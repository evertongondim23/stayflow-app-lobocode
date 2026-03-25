import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PATHS, ROUTE_PATTERNS } from "./paths";
import { RouteFallback } from "./RouteFallback";

const LoginPage = lazy(() =>
  import("../pages/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const LandingPage = lazy(() =>
  import("../pages/LandingPage").then((m) => ({ default: m.LandingPage }))
);
const GuestDashboard = lazy(() =>
  import("../pages/guest/GuestDashboard").then((m) => ({
    default: m.GuestDashboard,
  }))
);
const GuestPreCheckin = lazy(() =>
  import("../pages/guest/GuestPreCheckin").then((m) => ({
    default: m.GuestPreCheckin,
  }))
);
const GuestProfile = lazy(() =>
  import("../pages/guest/GuestProfile").then((m) => ({
    default: m.GuestProfile,
  }))
);
const GuestNotifications = lazy(() =>
  import("../pages/guest/GuestNotifications").then((m) => ({
    default: m.GuestNotifications,
  }))
);
const ReceptionDashboard = lazy(() =>
  import("../pages/reception/ReceptionDashboard").then((m) => ({
    default: m.ReceptionDashboard,
  }))
);

const AdminLayout = lazy(() =>
  import("../pages/admin/AdminLayout").then((m) => ({
    default: m.AdminLayout,
  }))
);
const AdminDashboard = lazy(() =>
  import("../pages/admin/AdminDashboard").then((m) => ({
    default: m.AdminDashboard,
  }))
);
const AdminSettings = lazy(() =>
  import("../pages/admin/AdminSettings").then((m) => ({
    default: m.AdminSettings,
  }))
);
const AdminStructure = lazy(() =>
  import("../pages/admin/AdminStructure").then((m) => ({
    default: m.AdminStructure,
  }))
);
const AdminUsers = lazy(() =>
  import("../pages/admin/AdminUsers").then((m) => ({
    default: m.AdminUsers,
  }))
);
const AdminFinance = lazy(() =>
  import("../pages/admin/AdminFinance").then((m) => ({
    default: m.AdminFinance,
  }))
);
const AdminPolicies = lazy(() =>
  import("../pages/admin/AdminPolicies").then((m) => ({
    default: m.AdminPolicies,
  }))
);
const AdminAudit = lazy(() =>
  import("../pages/admin/AdminAudit").then((m) => ({
    default: m.AdminAudit,
  }))
);
const AdminHealth = lazy(() =>
  import("../pages/admin/AdminHealth").then((m) => ({
    default: m.AdminHealth,
  }))
);

const ap = ROUTE_PATTERNS.admin;

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path={ROUTE_PATTERNS.home} element={<LoginPage />} />
        <Route path={ROUTE_PATTERNS.demo} element={<LandingPage />} />

        <Route
          path={ROUTE_PATTERNS.guest.checkin}
          element={<GuestPreCheckin />}
        />
        <Route
          path={ROUTE_PATTERNS.guest.dashboard}
          element={<GuestDashboard />}
        />
        <Route
          path={ROUTE_PATTERNS.guest.profile}
          element={<GuestProfile />}
        />
        <Route
          path={ROUTE_PATTERNS.guest.notifications}
          element={<GuestNotifications />}
        />

        <Route
          path={ROUTE_PATTERNS.reception}
          element={<ReceptionDashboard />}
        />

        <Route path={ROUTE_PATTERNS.admin.layout} element={<AdminLayout />}>
          <Route index element={<Navigate to={ap.dashboard} replace />} />
          <Route path={ap.dashboard} element={<AdminDashboard />} />
          <Route path={ap.settings} element={<AdminSettings />} />
          <Route path={ap.structure} element={<AdminStructure />} />
          <Route path={ap.users} element={<AdminUsers />} />
          <Route path={ap.finance} element={<AdminFinance />} />
          <Route path={ap.policies} element={<AdminPolicies />} />
          <Route path={ap.audit} element={<AdminAudit />} />
          <Route path={ap.health} element={<AdminHealth />} />
        </Route>

        <Route path="*" element={<Navigate to={PATHS.home} replace />} />
      </Routes>
    </Suspense>
  );
}
