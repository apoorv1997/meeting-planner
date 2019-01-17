import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { RouterModule } from '@angular/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginComponent } from './users/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { UsersModule } from './users/users.module';
import { HttpServiceService } from './http-service.service';
import { SocketServiceService } from './socket-service.service';
import { NormalUserModule } from './normal-user/normal-user.module';
import { AdminModule } from './admin/admin.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { ErrorHandlerComponent } from './error-handler/error-handler.component';


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    ErrorHandlerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    UsersModule,
    NormalUserModule,
    NgbModalModule,
    AdminModule,
    RouterModule.forRoot([
      {path:'login', component:LoginComponent, pathMatch:'full'},
      {path:'', component:LoginComponent},
      {path:'*', component:NotFoundComponent},
      {path:'**', component:NotFoundComponent},
      {path:'error/:errorCode', component:ErrorHandlerComponent}
    ])
  ],
  providers: [HttpServiceService,SocketServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }