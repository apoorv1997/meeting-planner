import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from 'src/app/http-service.service';
import {ActivatedRoute,Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  public email: String;
  public password: String;
  public apiResponse:any;
  constructor(private appService: HttpServiceService, private _route: ActivatedRoute, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.userDetails();
  }

  public userDetails = () => {
    let userId = this._route.snapshot.paramMap.get('userId');
    this.appService.getUserDetails(userId).subscribe(
      (response) => {
        if(response['status']==200){
          this.email = response['data']['email'];
        }
      },
      (err) => {
        console.log(err.errorMessage)
      }
    )
  }

  public resetPassword = () => {
    this.appService.updateUser(this.email, this.password).subscribe(
      (Response) => {
        if (Response['status'] === 200) {
          this.toastr.success('Password reset sucessfully')
          setTimeout(()=>{
            this.router.navigate(['/login'])
          },1000)

        } else {
          this.toastr.error(Response["message"])
        }
      }, (err) => {
        this.toastr.error('some error occured',err);
      }
    )
  }

}
