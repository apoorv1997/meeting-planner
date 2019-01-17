import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-error-handler',
  templateUrl: './error-handler.component.html',
  styleUrls: ['./error-handler.component.css']
})
export class ErrorHandlerComponent implements OnInit {

  public errorCode:any;

  constructor(private _route:ActivatedRoute,private toastr:ToastrService) { }

  ngOnInit() {
    this.errorCode = this._route.snapshot.paramMap.get('errorCode');
  }

}
