// ─────────────────────────────────────────────────────────────────────────────
// CrewClock Fairness Engine
// Scores and ranks employees for open shift assignment
// Ensures equitable distribution of preferred/undesired shifts
// ─────────────────────────────────────────────────────────────────────────────

export interface EmployeeForRanking {
  id: string;
  weeklyHoursWorked: number;
  weeklyHoursScheduled: number;
  weeklyTargetHours: number;
  hasRequiredSkills: boolean;
  isAvailable: boolean;
  complianceOk: boolean;
  preferenceLevel: number;   // 1=preferred, 2=neutral, 3=last-resort
  enrollmentTimestamp?: Date;
}

export interface RankedEmployee {
  employeeId: string;
  score: number;  // higher = should be assigned first
  reasons: string[];
}

/**
 * Rank employees for an open shift.
 * Priority: fewest hours → skills match → compliance OK → availability → timestamp
 */
export function rankForOpenShift(employees: EmployeeForRanking[]): RankedEmployee[] {
  const eligible = employees.filter((e) => e.isAvailable && e.hasRequiredSkills && e.complianceOk);

  const maxHours = Math.max(...eligible.map((e) => e.weeklyHoursWorked), 1);

  return eligible
    .map((e): RankedEmployee => {
      const hoursScore = 1 - e.weeklyHoursWorked / maxHours;          // 0-1 (fewer hours = higher)
      const hoursDeficit = Math.max(0, e.weeklyTargetHours - e.weeklyHoursScheduled);
      const deficitScore = Math.min(hoursDeficit / e.weeklyTargetHours, 1); // 0-1
      const preferenceScore = (4 - e.preferenceLevel) / 3;              // 1=1.0, 2=0.67, 3=0.33
      const timeScore = e.enrollmentTimestamp
        ? 1 - (Date.now() - e.enrollmentTimestamp.getTime()) / (24 * 3_600_000) // decay over 24h
        : 0;

      const score = hoursScore * 0.4 + deficitScore * 0.3 + preferenceScore * 0.2 + timeScore * 0.1;

      const reasons: string[] = [];
      if (hoursScore > 0.7) reasons.push("Lowest hours this week");
      if (deficitScore > 0.5) reasons.push("Below target hours");
      if (e.preferenceLevel === 1) reasons.push("Preferred this shift type");
      if (e.hasRequiredSkills) reasons.push("All required skills met");
      if (e.complianceOk) reasons.push("No compliance issues");

      return { employeeId: e.id, score, reasons };
    })
    .sort((a, b) => b.score - a.score);
}
