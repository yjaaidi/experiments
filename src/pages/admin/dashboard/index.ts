import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  template: ` <h1>Admin Dashboard</h1> `
})
export class AdminDashboardPageComponent {}

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: AdminDashboardPageComponent}
    ])
  ],
  declarations: [AdminDashboardPageComponent]
})
export class AdminDashboardPageComponentModule {}

export default AdminDashboardPageComponentModule;