import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from 'src/app/http-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  minDateForEvent:Date =new Date(Date.now());
  maxDateForEvent:Date =new Date(Date.now()+1000*60*60*24*365);

  users=[];

  public event ={
    'color':{'primary':'#123456','secoundry':'#123456'},
    'title':'',
    'purpose':'',
    'start':Date,
    'end':Date,
    'participants':[]
  };

  constructor(private httpService:HttpServiceService,private toastr:ToastrService,private router:Router,public location:Location) { }

  ngOnInit() {
    this.httpService.routeGuard();
    this.httpService.getAllUsers().subscribe(
      (response)=>{
        if(response['status']==200){
          this.users = response['data'];
        }else{
          this.router.navigate(['/error/'+response['status']])
        }
      },(err)=>{
        console.log(err);
        this.router.navigate(['/error/500'])
      }
    )
  }

  public createEvent = ()=>{
    if(!this.event['end']){
      this.toastr.warning('Event End Date not set')
    }else if(!this.event['start']){
      this.toastr.warning('Event Start Date not set')
    }else{
      if(this.event.participants.indexOf(Cookie.get('userId')) > -1){
        this.httpService.createEvent(this.event).subscribe(
          (response)=>{
            if(response['status']==200){
              setTimeout(()=>{
                this.location.back();
              },1000);
              this.toastr.success('New event Created');
            }
          },
          (error)=>{
            console.log(error);
          }
        ); 
      }else{
        this.event.participants.push(Cookie.get('userId'));
        this.httpService.createEvent(this.event).subscribe(
          (response)=>{
            if(response['status']==200){
              setTimeout(()=>{
                this.location.back();
              },1000);
              this.toastr.success('New event Created');
            }
          },
          (error)=>{
            console.log(error);
          }
        );
      }
    }
  };

}
