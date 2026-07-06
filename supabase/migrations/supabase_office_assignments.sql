-- ============================================================================
-- Neelgund-Tracker-Pro: Per-Employee Office Assignments
-- ============================================================================
-- Run this in your Supabase Dashboard > SQL Editor (once).
-- Safe to re-run — every statement is IF NOT EXISTS / idempotent.
--
-- What this adds:
--   1. office_locations.is_default  -> the office unassigned employees fall
--      back to (Neelgund, by default).
--   2. employee_office_assignments  -> one row per employee that has been
--      explicitly pinned to a specific office. Employees with no row here
--      fall back to the default office.
--   3. RLS so only admin / super_admin / hr / manager can create or change
--      assignments, while every signed-in user can read them (needed so an
--      employee's own app can figure out which office they must check in
--      from).
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. Default office flag
-- ────────────────────────────────────────────────────────────────────────────
ALTER TABLE office_locations
  ADD COLUMN IF NOT EXISTS is_default boolean NOT NULL DEFAULT false;

-- Only one office can ever be the default at a time.
CREATE UNIQUE INDEX IF NOT EXISTS idx_office_locations_single_default
  ON office_locations (is_default)
  WHERE is_default;

-- Backfill: mark an existing "Neelgund" office as default if one exists and
-- nothing is marked default yet. Otherwise fall back to the oldest office.
DO $$
DECLARE
  target_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM office_locations WHERE is_default) THEN
    SELECT id INTO target_id FROM office_locations
      WHERE name ILIKE 'Neelgund' ORDER BY created_at ASC LIMIT 1;

    IF target_id IS NULL THEN
      SELECT id INTO target_id FROM office_locations
        ORDER BY created_at ASC LIMIT 1;
    END IF;

    IF target_id IS NOT NULL THEN
      UPDATE office_locations SET is_default = true WHERE id = target_id;
    END IF;
  END IF;
END $$;

-- ────────────────────────────────────────────────────────────────────────────
-- 2. Employee -> Office assignment table
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS employee_office_assignments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  office_id    uuid NOT NULL REFERENCES office_locations(id) ON DELETE CASCADE,
  assigned_by  uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (employee_id)
);

CREATE INDEX IF NOT EXISTS idx_employee_office_assignments_office
  ON employee_office_assignments (office_id);

ALTER TABLE employee_office_assignments ENABLE ROW LEVEL SECURITY;

-- Anyone signed in can read assignments (needed so employees can resolve
-- their own office, and so admins/managers/HR can render the picker lists).
DROP POLICY IF EXISTS "office_assignments_select_all" ON employee_office_assignments;
CREATE POLICY "office_assignments_select_all"
  ON employee_office_assignments FOR SELECT
  TO authenticated
  USING (true);

-- Only admin / super_admin / hr / manager can create, change, or remove
-- assignments.
DROP POLICY IF EXISTS "office_assignments_write_privileged" ON employee_office_assignments;
CREATE POLICY "office_assignments_write_privileged"
  ON employee_office_assignments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin', 'hr', 'manager')
    )
  );

DROP POLICY IF EXISTS "office_assignments_update_privileged" ON employee_office_assignments;
CREATE POLICY "office_assignments_update_privileged"
  ON employee_office_assignments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin', 'hr', 'manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin', 'hr', 'manager')
    )
  );

DROP POLICY IF EXISTS "office_assignments_delete_privileged" ON employee_office_assignments;
CREATE POLICY "office_assignments_delete_privileged"
  ON employee_office_assignments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin', 'hr', 'manager')
    )
  );

-- ============================================================================
-- Done. After running this, every employee who has never been explicitly
-- assigned to an office will check in/out from the office marked
-- is_default = true (Neelgund). Admin/HR/Manager can move employees between
-- offices from the "Manage Offices" screen inside the Attendance tab.
-- ============================================================================
