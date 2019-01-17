import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  subMonths,
  addMonths,
  addWeeks,
  subWeeks,
  startOfMonth,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarMonthViewDay
} from 'angular-calendar';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpServiceService } from 'src/app/http-service.service';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies';
import { SocketServiceService } from 'src/app/socket-service.service';

type CalendarPeriod = 'day' | 'week' | 'month';

function addPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
  return {
    day: addDays,
    week: addWeeks,
    month: addMonths
  }[period](date, amount);
}

function subPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
  return {
    day: subDays,
    week: subWeeks,
    month: subMonths
  }[period](date, amount);
}

function startOfPeriod(period: CalendarPeriod, date: Date): Date {
  return {
    day: startOfDay,
    week: startOfWeek,
    month: startOfMonth
  }[period](date);
}

function endOfPeriod(period: CalendarPeriod, date: Date): Date {
  return {
    day: endOfDay,
    week: endOfWeek,
    month: endOfMonth
  }[period](date);
}

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {


  @ViewChild('modalContent')
  modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  viewPeriod: CalendarPeriod = 'month';

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  minDate: Date = subMonths(new Date(), 1);

  maxDate: Date = addMonths(new Date(), 11);

  prevBtnDisabled: boolean = false;

  nextBtnDisabled: boolean = false;

  socketData:any;

  eventInterval:any;

  skip=0;


  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-eye"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('watch', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];
  /*
  {
    start: new Date(Date.now()+1000*60*60*24*5),
    end:new Date(Date.now()+1000*60*60*24*6),
    title: 'An event with no end date',
    color: colors.yellow,
    actions: this.actions,
    draggable:true,
    resizable:{'beforeStart':true,'afterEnd':true}
  },{
    start: new Date(Date.now()+1000*60*60*24*4),
    end:new Date(Date.now()+1000*60*60*24*5),
    title: 'An event with no end date',
    color: colors.red,
    actions: this.actions,
    draggable:true,
    resizable:{'beforeStart':true,'afterEnd':true}
  },{
    start: new Date(Date.now()+1000*60*60*24*4),
    end:new Date(Date.now()+1000*60*60*24*5),
    title: 'An event with no end date',
    color: colors.red,
    actions: this.actions,
    draggable:true,
    resizable:{'beforeStart':true,'afterEnd':true}
  }
  */

  activeDayIsOpen: boolean = true;

  constructor(private modal: NgbModal, private router: Router, private _route: ActivatedRoute, private httpService: HttpServiceService, private toastr: ToastrService, private socket: SocketServiceService) {
    this.dateOrViewChanged();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();

  }

  handleEvent(action: string, event: CalendarEvent): void {
    if (action == 'Clicked') {
      this.router.navigate(['/view/' + event.id]);
    } else if (action == 'watch') {
      this.router.navigate(['/view/' + event.id]);
    }
    else {
      this.modalData = { event, action };
      this.modal.open(this.modalContent, { size: 'lg' });
    }
  }

  addEvent(): void {
    // this.events.push({
    //   title: 'New event',
    //   start: startOfDay(new Date()),
    //   end: endOfDay(new Date()),
    //   color: {'primary':'#652894','secondary':'#758625'},
    //   draggable: true,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   }
    // });
    // console.log(this.events);
    // this.refresh.next();
    this.router.navigate(['/create']);
  }

  ngOnInit() {
    let offSet = new Date().getTimezoneOffset() * 60000;
    this.httpService.getEventForUser(Cookie.get('userId')).subscribe(
      (response) => {
        if (response['status'] == 200) {
          response['data'].forEach((element) => {
            this.events.push({
              id: element.eventId,
              title: element['title'],
              start: new Date(new Date(element.start).getTime() + offSet),
              end: new Date(new Date(element.end).getTime() + offSet),
              color: { 'primary': element.colorPrimary, 'secondary': element.colorSecoundry },
              draggable: false,
              resizable: {
                beforeStart: false,
                afterEnd: false
              },
              actions: this.actions
            });
            this.refresh.next();
          });
        }else{
          this.toastr.warning('No more events found for this user');
        }
      }
    )

    this.socket.alerts().subscribe(
      (alerts) => {
        if(alerts['type']!='EventDeleted'){
          this.socketData = alerts['data'];
        }

        if(alerts['type']=='EventAlert'){
          this.modalData = {'event':alerts['message'],'action':alerts['type']};
          this.modal.open(this.modalContent, { size: 'lg' });
          this.eventInterval = setInterval(()=>{
            this.modalData = {'event':alerts['message'],'action':alerts['type']};
            this.modal.open(this.modalContent, { size: 'lg' });
          },1000*5);

          setTimeout(()=>{
            if(this.eventInterval){
              clearInterval(this.eventInterval);
            }
          },1000*60);
        }else{
          this.modalData = {'event':alerts['message'],'action':alerts['type']};
          this.modal.open(this.modalContent, { size: 'lg' });
        }
      }
    )

  }

  closeEventInterval=()=>{
    this.socketData = null;
    clearInterval(this.eventInterval);
  };



  increment(): void {
    this.changeDate(addPeriod(this.viewPeriod, this.viewDate, 1));
  }

  decrement(): void {
    this.changeDate(subPeriod(this.viewPeriod, this.viewDate, 1));
  }

  today(): void {
    this.changeDate(new Date());
  }

  dateIsValid(date: Date): boolean {
    return date >= this.minDate && date <= this.maxDate;
  }

  changeDate(date: Date): void {
    this.viewDate = date;
    this.dateOrViewChanged();
  }

  changeView(view: CalendarPeriod): void {
    this.viewPeriod = view;
    this.dateOrViewChanged();
  }

  dateOrViewChanged(): void {
    this.prevBtnDisabled = !this.dateIsValid(
      endOfPeriod(this.viewPeriod, subPeriod(this.viewPeriod, this.viewDate, 1))
    );
    this.nextBtnDisabled = !this.dateIsValid(
      startOfPeriod(this.viewPeriod, addPeriod(this.viewPeriod, this.viewDate, 1))
    );
    if (this.viewDate < this.minDate) {
      this.changeDate(this.minDate);
    } else if (this.viewDate > this.maxDate) {
      this.changeDate(this.maxDate);
    }
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(day => {
      if (!this.dateIsValid(day.date)) {
        day.cssClass = 'cal-disabled';
      }
    });
  }

  public logOut = () => {
    this.httpService.logout().subscribe(
      (response) => {
        if (response['status'] == 200) {
          this.router.navigate(['/login']);
          this.toastr.success('You are Logged Out')
        }
      }
    )
  };

  loadMore = ()=>{
    this.skip +=1;
    let offSet =new Date().getTimezoneOffset()*60000;
    this.httpService.getEventForUser(this._route.snapshot.paramMap.get('userId'),this.skip*10).subscribe(
      (response) => {
        console.log(response)
        if (response['status'] == 200) {
          response['data'].forEach((element) => {
            this.events.push({
              id:element.eventId,
              title: element['title'],
              start:new Date(new Date(element.start).getTime() + offSet),
              end:new Date(new Date(element.end).getTime() + offSet),
              color: {'primary':element.colorPrimary,'secondary':element.colorSecoundry},
              draggable: true,
              resizable: {
                beforeStart: true,
                afterEnd: true
              },
              actions:this.actions
            });
            this.refresh.next();
            this.toastr.success('More events Loaded');
          });
        }else{
          this.toastr.warning('No more events found for this user');
        }
      }
    )
  }

}
