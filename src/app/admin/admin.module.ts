import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { EditComponent } from './edit/edit.component';
import { CreateComponent } from './create/create.component';
import { UsersListComponent } from './users-list/users-list.component';


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
      { path: 'adminDashboard/:userId', component: DashboardComponent },
      { path: 'create', component: CreateComponent },
      { path: 'edit/:eventId', component: EditComponent },
      { path: 'usersList',component: UsersListComponent }
    ])
  ],entryComponents: [
    DashboardComponent,
  ],
  declarations: [DashboardComponent, EditComponent, CreateComponent, UsersListComponent]
})
export class AdminModule { }
