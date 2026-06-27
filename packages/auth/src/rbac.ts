// ─────────────────────────────────────────────────────────────────────────────
// Role-Based Access Control helpers
// ─────────────────────────────────────────────────────────────────────────────

export type Role = "super_admin" | "admin" | "manager" | "supervisor" | "employee";

export const ROLE_HIERARCHY: Record<Role, number> = {
  super_admin: 5,
  admin: 4,
  manager: 3,
  supervisor: 2,
  employee: 1,
};

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canManageSchedules(role: Role) {
  return hasRole(role, "manager");
}

export function canApproveTimecards(role: Role) {
  return hasRole(role, "supervisor");
}

export function canManagePayroll(role: Role) {
  return hasRole(role, "admin");
}

export function canViewReports(role: Role) {
  return hasRole(role, "supervisor");
}

export function canManageTeam(role: Role) {
  return hasRole(role, "manager");
}

export function canManageBilling(role: Role) {
  return hasRole(role, "admin");
}

export const PERMISSIONS = {
  schedule: {
    view: "employee" as Role,
    create: "manager" as Role,
    publish: "manager" as Role,
    delete: "manager" as Role,
  },
  timeclock: {
    clockSelf: "employee" as Role,
    viewAll: "supervisor" as Role,
    override: "manager" as Role,
  },
  timecard: {
    submit: "employee" as Role,
    approve: "supervisor" as Role,
    lock: "manager" as Role,
  },
  payroll: {
    view: "manager" as Role,
    run: "admin" as Role,
    export: "admin" as Role,
  },
  team: {
    view: "supervisor" as Role,
    invite: "manager" as Role,
    manage: "admin" as Role,
  },
  leave: {
    request: "employee" as Role,
    approve: "supervisor" as Role,
  },
  ai: {
    chat: "employee" as Role,
    index: "manager" as Role,
  },
  reports: {
    view: "supervisor" as Role,
    export: "manager" as Role,
  },
} as const;
