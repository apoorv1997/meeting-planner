import { Component, OnInit } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import { HttpServiceService } from 'src/app/http-service.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public firstName: any;
  public lastName: any;
  public mobile: any;
  public email: any;
  public password: any;
  country:any = '91';

  countries = [{'name':'India','countryId':'91'}];

  constructor(private toastr: ToastrService,private appService: HttpServiceService,private router: Router){}

  ngOnInit() {
    this.countries = this.appService.getCountriesData();
  }

  public goToSignIn: any = () => {
    this.router.navigate(['/']);
  }//goToSignIn end here

  public signupFunction: any = ()=> {
    if (!this.firstName) {
      this.toastr.warning('Enter first Name')
    } else if (!this.lastName) {
      this.toastr.warning('Enter Last Name')
    } else if (!this.mobile) {
      this.toastr.warning('Enter Mobile No')
    } else if (!this.email) {
      this.toastr.warning('Enter Email')
    } else if (!this.password) {
      this.toastr.warning('Enter Password')
    } else {
      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobile: this.country+this.mobile,
        email: this.email,
        password: this.password
      }

      this.appService.signupFunction(data)
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
            this.toastr.success('Signup Successful');
            setTimeout(() => {
              this.goToSignIn();
            }, 2000);
          } else {
            this.toastr.error(apiResponse.message);
          }
        }, (err) => {
          console.log(err.message+','+err)
          this.toastr.error('Some error occured');
        });
    }
  }//signupFunction end here

}
