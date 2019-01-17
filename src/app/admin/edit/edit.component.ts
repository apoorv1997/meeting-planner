import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from 'src/app/http-service.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {


  minDateForEvent:Date =new Date(Date.now());
  maxDateForEvent:Date =new Date(Date.now()+1000*60*60*24*365);

  users=['me','him','her','his','them','those','male','female'];

  public event ={
    'id':this._route.snapshot.paramMap.get('eventId'),
    'color':{'primary':'#123456','secoundry':'#123456'},
    'title':'',
    'start':new Date(),
    'end':new Date(),
    'purpose':'',
    'participants':''
  };

  constructor(private httpService:HttpServiceService,private toastr:ToastrService,private _route:ActivatedRoute,private router:Router,public location:Location) { }

  ngOnInit() {
    this.httpService.routeGuard();
    let offSet = new Date().getTimezoneOffset()*60000;
    this.httpService.getAllUsers().subscribe(
      (response)=>{
        if(response['status']==200){
          this.users = response['data'];
        }
      },(err)=>{
        console.log(err);
      }
    )

    this.httpService.getAEvent(this.event.id).subscribe(
      (response)=>{
        if(response['status']==200){
          this.event = response['data'];
          this.event.start = new Date(new Date(this.event.start).getTime() + offSet);
          this.event.end = new Date(new Date(this.event.end).getTime() + offSet);
          this.event.id = this._route.snapshot.paramMap.get('eventId');
          this.event.color = {
            'primary':this.event['colorPrimary'],
            'secoundry':this.event['colorSecoundry']
          }
          console.log(this.event);
        }
      }
    )

  }

  public editEvent = ()=>{
    console.log('edit clicked',this.event)
    if(new Date(this.event.start) < new Date(this.event.end)){
      this.httpService.editEvent(this.event).subscribe(
        (response)=>{
          if(response['status']==200){
            setTimeout(()=>{
              this.location.back();
            },1000);
            this.toastr.success('Event Edited');
          }else{
            this.router.navigate(['/error/'+response['status']])
          }
        },
        (error)=>{
          console.log(error);
        }
      );
    }else{
      this.toastr.warning('Event start should be less than event end');
    }
  };

  public deleteEvent = ()=>{
    this.httpService.deleteEvent(this.event.id).subscribe(
      (response)=>{
        if(response['status']==200){
          this.toastr.success('Event Deleted');
          setTimeout(()=>{
            this.router.navigate(['/usersList'])
          },2000);
        }
      }
    );
  };

}
