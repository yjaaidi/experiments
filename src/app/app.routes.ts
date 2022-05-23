import { Routes } from "@angular/router";

export const ROUTES: Routes = [
  {
    path: "dashboard",
    loadChildren: async () =>
      (await import("./pages/dashboard-page.component")).DashboardPageModule,
  },
  {
    path: "customer",
    loadChildren: async () =>
      (await import("./pages/customer-page.component")).CustomerPageModule,
  },
  {
    path: "**",
    pathMatch: "full",
    redirectTo: "dashboard",
  },
];
