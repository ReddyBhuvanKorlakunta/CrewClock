// ─────────────────────────────────────────────────────────────────────────────
// CrewClock Compliance Engine
// Checks: clopening, max hours, rest periods, predictive scheduling
// ─────────────────────────────────────────────────────────────────────────────

export interface ShiftWindow {
  employeeId: string;
  startTime: Date;
  endTime: Date;
}

export interface ComplianceViolation {
  type: "clopening" | "max_daily_hours" | "max_weekly_hours" | "insufficient_rest" | "max_shifts_per_week";
  employeeId: string;
  severity: "error" | "warning";
  message: string;
  shiftIds?: string[];
}

const MIN_REST_HOURS = 10;
const MAX_DAILY_HOURS = 10;
const MAX_WEEKLY_HOURS = 40;
const MAX_SHIFTS_PER_WEEK = 5;

export function checkClopening(shifts: ShiftWindow[]): ComplianceViolation[] {
  const violations: ComplianceViolation[] = [];
  const byEmployee = groupBy(shifts, (s) => s.employeeId);

  for (const [employeeId, empShifts] of Object.entries(byEmployee)) {
    const sorted = empShifts.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    for (let i = 0; i < sorted.length - 1; i++) {
      const gap = (sorted[i + 1].startTime.getTime() - sorted[i].endTime.getTime()) / 3_600_000;
      if (gap < MIN_REST_HOURS) {
        violations.push({
          type: "clopening",
          employeeId,
          severity: "error",
          message: `Only ${gap.toFixed(1)} hours rest between shifts (minimum ${MIN_REST_HOURS}h required)`,
        });
      }
    }
  }
  return violations;
}

export function checkWeeklyLimits(shifts: ShiftWindow[]): ComplianceViolation[] {
  const violations: ComplianceViolation[] = [];
  const byEmployee = groupBy(shifts, (s) => s.employeeId);

  for (const [employeeId, empShifts] of Object.entries(byEmployee)) {
    // Check shift count
    if (empShifts.length > MAX_SHIFTS_PER_WEEK) {
      violations.push({
        type: "max_shifts_per_week",
        employeeId,
        severity: "warning",
        message: `${empShifts.length} shifts scheduled this week (max ${MAX_SHIFTS_PER_WEEK})`,
      });
    }
    // Check total hours
    const totalHours = empShifts.reduce(
      (sum, s) => sum + (s.endTime.getTime() - s.startTime.getTime()) / 3_600_000,
      0,
    );
    if (totalHours > MAX_WEEKLY_HOURS) {
      violations.push({
        type: "max_weekly_hours",
        employeeId,
        severity: "warning",
        message: `${totalHours.toFixed(1)} hours scheduled this week (max ${MAX_WEEKLY_HOURS}h)`,
      });
    }
  }
  return violations;
}

function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item);
    acc[k] = acc[k] ?? [];
    acc[k].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}
