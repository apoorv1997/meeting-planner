import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewEventComponent } from './view-event/view-event.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    RouterModule.forChild([
      { path: 'normalDashboard', component: DashboardComponent },
      { path: 'view/:eventId', component: ViewEventComponent }
    ])
  ], 
  entryComponents: [
    DashboardComponent,
  ],
  exports: [
    DashboardComponent,
  ],
  declarations: [DashboardComponent, ViewEventComponent]
})
export class NormalUserModule { }
