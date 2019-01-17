import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ToastrModule} from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResetComponent } from './reset/reset.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {path:'sign-up', component:SignupComponent},
      {path:'resetPassword/:userId',component:ResetComponent},
      {path:'forgotPassword',component:ForgotPasswordComponent}
    ]),
    ToastrModule.forRoot(),
    BrowserAnimationsModule
  ],
  declarations: [LoginComponent, SignupComponent, ForgotPasswordComponent, ResetComponent]
})
export class UsersModule { }