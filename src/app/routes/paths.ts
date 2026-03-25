/** URLs absolutas para navegação (Link, navigate). */
export const PATHS = {
  home: "/",
  /** Simulação com personas (João / Maria / Carlos). */
  demo: "/demo",
  reception: "/reception",
  admin: {
    root: "/admin",
    dashboard: "/admin/dashboard",
    settings: "/admin/settings",
    structure: "/admin/structure",
    users: "/admin/users",
    finance: "/admin/finance",
    policies: "/admin/policies",
    audit: "/admin/audit",
    health: "/admin/health",
  },
  guest: {
    dashboard: (reservationId: string) => `/guest/${reservationId}`,
    profile: (reservationId: string) => `/guest/profile/${reservationId}`,
    notifications: (reservationId: string) =>
      `/guest/notifications/${reservationId}`,
    checkin: (reservationId: string) => `/guest/checkin/${reservationId}`,
  },
} as const;

/** Padrões com parâmetros para `<Route path="...">`. */
export const ROUTE_PATTERNS = {
  home: "/",
  demo: "/demo",
  reception: "/reception",
  guest: {
    dashboard: "/guest/:id",
    profile: "/guest/profile/:id",
    notifications: "/guest/notifications/:id",
    checkin: "/guest/checkin/:id",
  },
  admin: {
    layout: "/admin",
    dashboard: "dashboard",
    settings: "settings",
    structure: "structure",
    users: "users",
    finance: "finance",
    policies: "policies",
    audit: "audit",
    health: "health",
  },
} as const;
