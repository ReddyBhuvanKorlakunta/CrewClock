// ─────────────────────────────────────────────────────────────────────────────
// CrewClock Payroll Calculator
// Handles: Regular pay, OT (daily & weekly), CA 7th-day, meal penalties
// ─────────────────────────────────────────────────────────────────────────────

export interface ShiftRecord {
  date: string;        // YYYY-MM-DD
  regularMinutes: number;
  breakMinutes: number;
  mealBreakTaken: boolean;
  mealBreakDurationMinutes: number;
}

export interface PayrollInput {
  jurisdiction: string;    // e.g. "CA", "NY", "federal"
  hourlyRate: number;
  otMultiplier: number;    // default 1.5
  doubleOtMultiplier: number; // default 2.0 (CA)
  shifts: ShiftRecord[];
}

export interface PayrollResult {
  regularMinutes: number;
  otMinutes: number;
  doubleOtMinutes: number;
  mealPenaltyMinutes: number;   // 60 min per violation
  regularPay: number;
  otPay: number;
  doubleOtPay: number;
  mealPenaltyPay: number;
  grossPay: number;
  details: Array<{ date: string; type: string; minutes: number; pay: number }>;
}

export function calculatePayroll(input: PayrollInput): PayrollResult {
  const { jurisdiction, hourlyRate, otMultiplier, doubleOtMultiplier, shifts } = input;
  const ratePerMinute = hourlyRate / 60;
  const result: PayrollResult = {
    regularMinutes: 0, otMinutes: 0, doubleOtMinutes: 0, mealPenaltyMinutes: 0,
    regularPay: 0, otPay: 0, doubleOtPay: 0, mealPenaltyPay: 0, grossPay: 0, details: [],
  };

  let weeklyMinutes = 0;
  const isCA = jurisdiction === "CA";

  shifts.forEach((shift, dayIndex) => {
    const workedMinutes = shift.regularMinutes - shift.breakMinutes;
    const dailyHours = workedMinutes / 60;

    let dailyRegular = 0, dailyOt = 0, dailyDoubleOt = 0;

    // ── California daily OT rules ──────────────────────────────────────────
    if (isCA) {
      if (dailyHours <= 8) {
        dailyRegular = workedMinutes;
      } else if (dailyHours <= 12) {
        dailyRegular = 8 * 60;
        dailyOt = workedMinutes - dailyRegular;
      } else {
        dailyRegular = 8 * 60;
        dailyOt = 4 * 60;
        dailyDoubleOt = workedMinutes - dailyRegular - dailyOt;
      }
      // 7th consecutive day rules
      if (dayIndex === 6) {
        if (dailyHours <= 8) {
          dailyOt = workedMinutes;
          dailyRegular = 0;
        } else {
          dailyOt = 8 * 60;
          dailyDoubleOt = workedMinutes - dailyOt;
          dailyRegular = 0;
        }
      }
    } else {
      // Federal: weekly OT only
      dailyRegular = workedMinutes;
    }

    // ── Weekly OT (federal 40h threshold) ─────────────────────────────────
    weeklyMinutes += dailyRegular;
    if (!isCA && weeklyMinutes > 40 * 60) {
      const otFromWeek = weeklyMinutes - 40 * 60;
      dailyOt += otFromWeek;
      dailyRegular -= otFromWeek;
    }

    // ── California meal penalty ────────────────────────────────────────────
    let mealPenalty = 0;
    if (isCA && dailyHours > 5 && (!shift.mealBreakTaken || shift.mealBreakDurationMinutes < 30)) {
      mealPenalty = 60; // 1 hour premium
    }
    if (isCA && dailyHours > 10 && shift.mealBreakDurationMinutes < 60) {
      mealPenalty += 60; // Second meal penalty
    }

    const regularPay = dailyRegular * ratePerMinute;
    const otPay = dailyOt * ratePerMinute * otMultiplier;
    const doubleOtPay = dailyDoubleOt * ratePerMinute * doubleOtMultiplier;
    const mealPenaltyPay = mealPenalty * ratePerMinute;

    result.regularMinutes += dailyRegular;
    result.otMinutes += dailyOt;
    result.doubleOtMinutes += dailyDoubleOt;
    result.mealPenaltyMinutes += mealPenalty;
    result.regularPay += regularPay;
    result.otPay += otPay;
    result.doubleOtPay += doubleOtPay;
    result.mealPenaltyPay += mealPenaltyPay;

    if (dailyOt > 0 || dailyDoubleOt > 0 || mealPenalty > 0) {
      result.details.push({ date: shift.date, type: "ot", minutes: dailyOt, pay: otPay });
      if (dailyDoubleOt > 0) result.details.push({ date: shift.date, type: "double_ot", minutes: dailyDoubleOt, pay: doubleOtPay });
      if (mealPenalty > 0) result.details.push({ date: shift.date, type: "meal_penalty", minutes: mealPenalty, pay: mealPenaltyPay });
    }
  });

  result.grossPay = result.regularPay + result.otPay + result.doubleOtPay + result.mealPenaltyPay;
  return result;
}
