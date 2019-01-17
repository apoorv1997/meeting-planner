import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies';
import {Router} from '@angular/router';
import {HttpServiceService} from './../../http-service.service';
import {ToastrService} from 'ngx-toastr';
import { SocketServiceService } from 'src/app/socket-service.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: any;
  public password: any;
  constructor(private router:Router, private appService: HttpServiceService, private toastr:ToastrService,private socket:SocketServiceService) { }

  ngOnInit() {
  }

  public goToSignUp: any = ()=>{
    this.router.navigate(['/sign-up']);
  }//goToSignIn

  public signinFunction: any = ()=>{
    console.log(this.email,this.password);
    if(!this.email){
      this.toastr.warning("Enter the email");
    }else if(!this.password){
      this.toastr.warning("Enter the password");
    }else{
      let data = {
        email: this.email,
        password: this.password
      }

      this.appService.signinFunction(data)
      .subscribe((apiResponse) =>{
        if(apiResponse.status ===200){
          //setting the cokies here 
          Cookie.set('authtoken', apiResponse.data.authToken);
          Cookie.set('userId', apiResponse.data.userDetails.userId);
          Cookie.set('userName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
          this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails);
          this.toastr.success(apiResponse.message,'Login Sucessful');
          if(apiResponse['data']['userDetails']['firstName'].indexOf('admin')>-1){
            this.router.navigate(['/usersList']);
          }else{
            this.router.navigate(['/normalDashboard']);
          }
        } else{
          this.toastr.error(apiResponse.message)
        }
      },(err)=>{
        if(err.status===500){
        this.toastr.error('Invalid Password');
        }
      })

    }
  }//signInFunction end here

  public forgotPasswordFunction = () =>{
    this.router.navigate(['/forgotPassword'])
  }
}
