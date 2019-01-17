import { Injectable } from '@angular/core';
//OBSERVABLE IMPORTING
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

import * as io from 'socket.io-client';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
//TOASTR IMPORTING
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { HttpServiceService } from './http-service.service';

@Injectable({
  providedIn: 'root'
})
export class SocketServiceService {
  private url = 'http://localhost:3000';
  private socket;

  constructor(private toastr: ToastrService, private http: HttpClient, private httpService: HttpServiceService) {
    this.socket = io(this.url);
  }

  public alerts = () => {
    return Observable.create((observer)=>{
      this.socket.on(Cookie.get('userId'),(data)=>{
        observer.next(data);
      });
    });
  };

  public scheduledAlerts = (data) =>{
    return Observable.create((observer)=>{
      this.socket.on(data,(newData)=>{
        observer.next(newData);
      });
    });
  };
}
