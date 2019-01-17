import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from 'src/app/http-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  public users = [];

  constructor(private http:HttpServiceService,private router:Router,private toastr:ToastrService) { }

  ngOnInit() {
    this.http.routeGuard();
    this.http.getAllUsers().subscribe(
      (response)=>{
        if(response['status']==200){
          this.users = response['data'];
        }else{
          this.router.navigate(['/error/'+response['status']])
        }
      }
    )
  }

  public logOut = ()=>{
    this.http.logout().subscribe(
      (response)=>{
        if(response['status']==200){
          this.router.navigate(['/login']);
          this.toastr.success('You are Logged Out')
        }
      }
    )
  };

}
