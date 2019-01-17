import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from 'src/app/http-service.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.css']
})
export class ViewEventComponent implements OnInit {

  public event:any;
  public users=[];
  public offSet = new Date().getTimezoneOffset()*60000;

  constructor(private http:HttpServiceService,private toastr:ToastrService,
    private _route:ActivatedRoute,public location:Location,private router:Router) { }

  ngOnInit() {
    this.http.getAEvent(this._route.snapshot.paramMap.get('eventId')).subscribe(
      (response)=>{
        if(response['status']==200){
          this.event = response['data'];
          this.event.start = new Date(new Date(this.event.start).getTime() + this.offSet);
          this.event.end = new Date(new Date(this.event.end).getTime() + this.offSet);
          this.http.getAllUsers().subscribe(
            (response)=>{
              if(response['status']==200){
                response['data'].forEach((user)=>{
                  if(this.event.participants.indexOf(user.userId) > -1){
                    this.users.push(user);
                  }
                });
              }
            },
            (err)=>{
              console.log(err);
            }
          )
        }else{
          this.toastr.warning("The following event is not present");
          this.router.navigate(['/error/'+response['status']])
        }
      },(error)=>{
        console.log(error);
      }
    );
  }

}
