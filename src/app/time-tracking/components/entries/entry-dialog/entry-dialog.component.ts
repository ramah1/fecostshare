import { Component, OnInit, Input } from '@angular/core';
import { ITimeTrackingEntry, IClient, IProject, ITask, IUser, ProjectService, TaskService, TimeTrackingEntryService, UserService, ClientService, RegistryService } from '../../../../data';
import { LoginService } from '../../../../login';
import { Http } from '@angular/http';
import { environment } from '../../../../../environments/environment';
import moment from 'moment/src/moment';
import { Observable } from 'rxjs/Rx';
import { MdDialogRef, MdDatepickerModule, DateAdapter, MdNativeDateModule } from '@angular/material';
// import { MD_NATIVE_DATE_FORMATS } from "app";
// import { DeDateAdapter } from "app/dateAdapter";

@Component({
  selector: 'app-entry-dialog',
  templateUrl: './entry-dialog.component.html'
})
export class EntryDialogComponent implements OnInit {
  public baseUrl: string = environment.apiBaseUrl;
  @Input() projects: IProject[] = [];
  @Input() clients: IClient[] = [];
  @Input() tasks: ITask[] = [];
  public title: string;
  public description: string;
  public selectedProjectID: string;
  public rowid: number;
  public selectedTaskID: string;
  @Input() selectedDate: string;
  @Input() selectedStartTime: string;
  public user: IUser;
  public selectedEndTime: any;
  public userprofileID: any;
  public clientID: any;
  public projectID: any;
  public taskID: any;
  public entryDate: any;
  @Input() startTime: any;
  @Input() endTime: any;
  public timeSpent: any;

  public isBillable: boolean = false;
  public enableTimes: boolean = false;
  @Input() date: any;
  @Input() checkBoxTimes: boolean;
  @Input() myFilter: any;
  public validTimePeriod: boolean;


  constructor(
    public dialogRef: MdDialogRef<EntryDialogComponent>,
    public clientService: ClientService,
    public projectService: ProjectService,
    public taskService: TaskService,
    public timeTrackingEntryService: TimeTrackingEntryService,
    public userService: UserService,
    private http: Http,
    public loginService: LoginService,
    private dateAdapter: DateAdapter<Date>,
    public registryService: RegistryService
  ) {
  }

  ngOnInit() {
    this.loadItems();
    this.myFilter = (d: Date): boolean => {
      const day = d.getDay();
      // Prevent Saturday and Sunday from being selected.
      return day !== 0 && day !== 6;
    }
  }

  public checkIsBillable() {
    this.isBillable = !this.isBillable;
  }

  public checkEnableTimes() {
    this.enableTimes = !this.enableTimes;
  }

  public readDate(valueDate: any) {
    if (valueDate._selected) {
      let validDate = moment(valueDate._selected).format('L');
      let currentDate = validDate.substring(3, 5) + "." + validDate.substring(0, 2) + "." + validDate.substring(6, 10);
      this.selectedDate = currentDate;
    }
  }

  public getValues(valueDesc: string, valueDate: any, valueStartTime: string, valueEndTime: string, valueTimeSpent: string, valueClientID: string, valueProjectID: number, valueTaskID: number, valueEnableTimes: any, valueIsBillable: any) {
    this.description = valueDesc;
    this.selectedDate = valueDate;
    this.startTime = valueStartTime;
    this.endTime = valueEndTime;
    this.timeSpent = valueTimeSpent;
    this.clientID = valueClientID;
    this.projectID = valueProjectID;
    this.taskID = valueTaskID;
    this.checkBoxTimes = valueEnableTimes.checked;
    this.isBillable = valueIsBillable.checked;
    this.validTimePeriod = moment(this.startTime, 'HH:mm').isBefore(moment(this.endTime, 'HH:mm'));
  }

  public clientDropdown(value: string): void {
    this.clientID = value;
  }

  public projectDropdown(value: string): void {
    this.projectID = value;
  }

  public taskDropdown(value: string): void {
    this.taskID = value;
  }

  public checkMandatoryFields() {
    if (!this.enableTimes) {
      if (this.description === "" || this.clientID === null || this.selectedDate === undefined || this.timeSpent === null || this.isBillable === null) {
        alert("Please check if all the fields are filled in");
      } else {
        this.startTime = moment().format('HH:mm');
        this.decimalToTime(this.timeSpent);
      }
    }
    else {
      if (this.description === "" || this.selectedDate === undefined || this.startTime === " " || this.endTime === " " || this.isBillable === null) {
        alert("Please check if all the fields are filled in");
      } else {
        this.timeSpent = this.calculateSpentTime();
        this.checkStartAndEndTime();
      }
    }
  }

  public checkStartAndEndTime() {
    if (!this.validTimePeriod) {
      alert("Please enter a valid endtime.")
    }
    else {
      this.newEntry();
    }
  }

  public calculateSpentTime() {
    let timeSpent: string;
    let timeSpentH: number;
    let timeSpentMin: number;
    let startTimeH: number = parseInt(this.startTime.substring(0, 2));
    let startTimeMin: number = parseInt(this.startTime.substring(3, 5));

    let endTimeH: number = parseInt(this.endTime.substring(0, 2));
    let endTimeMin: number = parseInt(this.endTime.substring(3, 5));
    if (endTimeMin >= startTimeMin) {
      timeSpentMin = endTimeMin - startTimeMin;
      timeSpentH = endTimeH - startTimeH;
    } else {
      timeSpentMin = endTimeMin - startTimeMin + 60;
      timeSpentH = endTimeH - startTimeH - 1;
    }

    if ((timeSpentH.toString()).length < 2 && (timeSpentMin.toString()).length < 2) {
      timeSpent = '0' + timeSpentH + ':0' + timeSpentMin;
    }
    else if ((timeSpentH.toString()).length < 2) {
      timeSpent = '0' + timeSpentH + ':' + timeSpentMin;
    }
    else if ((timeSpentMin.toString()).length < 2) {
      timeSpent = timeSpentH + ':0' + timeSpentMin;
    } else {
      timeSpent = timeSpentH + ':' + timeSpentMin;
    }
    return timeSpent;
  }

  public keyDownFunction(event) {
    if (event.key == 'Enter') {
      this.checkMandatoryFields();
    }
  }

  public decimalToTime(t: any) {
    // t is a decimal value
    if (this.isNumeric(t.toString()) === true) {
      let hours = parseInt(t);
      let minutes = Math.round((parseFloat(t) - hours) * 60);
      if (hours.toString().length < 2 && minutes.toString().length > 1) {
        this.timeSpent = '0' + hours + ':' + minutes;
      }
      else if (hours.toString().length < 2 && minutes > 6 && minutes.toString().length < 2) {
        this.timeSpent = '0' + hours + ':' + minutes + '0';
      }
      else if (hours.toString().length < 2 && minutes < 7 && minutes.toString().length < 2) {
        this.timeSpent = '0' + hours + ':' + '0' + minutes;
      }
      else if (hours.toString().length > 1 && minutes > 6 && minutes.toString().length < 2) {
        this.timeSpent = hours + ':' + minutes + '0';
      }
      else if (hours.toString().length > 1 && minutes < 7 && minutes.toString().length < 2) {
        this.timeSpent = hours + ':' + '0' + minutes;
      }
      else {
        this.timeSpent = hours + ':' + minutes;
      }
      let endT = moment() + moment.duration().add(this.timeSpent, 'HH:mm');
      this.endTime = moment(endT).format('HH:mm');
      this.newEntry();
    }
    else if (t.toString().indexOf(':') !== -1) {
      this.timeSpent = t;
      let endT = moment() + moment.duration().add(this.timeSpent, 'HH:mm');
      this.endTime = moment(endT).format('HH:mm');
      this.newEntry();
    }
    else {
      alert('Wrong format !');
    }
  }

  private isNumeric(input) {
    var RE = /^-{0,1}\d*\.{0,1}\d+$/;
    return (RE.test(input));
  }

  public newEntry() {
    // this.loadItems();
    return this.http.post(this.baseUrl + "/timeentries",
      {
        entryDate: this.selectedDate,
        startTime: this.startTime,
        endTime: this.endTime,
        timeSpent: this.timeSpent,
        description: this.description,
        userprofileID: this.loginService.getLoggedUserID(),
        taskID: this.taskID,
        clientID: this.clientID,
        projectID: this.projectID,
        billable: this.isBillable
      }).subscribe(
      () => {
        this.dialogRef.close(true);
        this.loadItems();
      },
      (err) => {
        if (err.status === 400 || err.status === 404) {
          alert('Wrong date format or fill all field !');
          return Observable.of(undefined);
        }
        if (err.status === 500) {
          alert('Internal server error !')
        }
      })
  }

  private loadItems() {
    this.http.get(this.baseUrl + "/clients").map(res => res.json()).subscribe(
      results => {
        this.clients = results.sort(this.registryService.propComparator('clientName'));
      });

    this.http.get(this.baseUrl + "/tasks").map(res => res.json()).subscribe(
      results => {
        this.tasks = results.sort(this.registryService.propComparator('taskDescription'));
      });

    this.http.get(this.baseUrl + "/projects").map(res => res.json()).subscribe(
      results => {
        this.projects = results.sort(this.registryService.propComparator('projectName'));
      });
  }
}