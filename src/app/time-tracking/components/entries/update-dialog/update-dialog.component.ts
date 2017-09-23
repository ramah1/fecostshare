import { Component, OnInit, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { ITimeTrackingEntry, IProject, ITask, ProjectService, TaskService, TimeTrackingEntryService } from '../../../../data';
import { environment } from '../../../../../environments/environment';
import { LoginService } from '../../../../login';

@Component({
  selector: 'app-update-dialog',
  templateUrl: './update-dialog.component.html'
})
export class UpdateDialogComponent implements OnInit {
  public baseUrl: string = environment.apiBaseUrl;
  @Input() projects: IProject[] = [];
  @Input() tasks: ITask[] = [];
  public title: string;
  public message: string;
  public rowID: number;
  public selectedDescription: string;
  @Input() selectedProject: any;
  @Input() selectedTask: any;
  @Input() selectedDate: any;
  @Input() selectedStartTime: any;
  public userprofileID: any;
  @Input() clientID: any;
  @Input() projectID: any;
  @Input() taskID: any;
  public selectedEndTime: any;
  public selectedTimeSpent: any;
  public description: string;
  public entryDate: any;
  public startTime: any;
  public endTime: any;
  public timeSpent: any;
  public isBillable: boolean;
  userID: number;
  @Input() tempTaskID: number;
  @Input() tempProjectID: number;
  public items: ITimeTrackingEntry[] = [];
  public result: any;

  public projectDropdown(value: string): void {
    this.projectID = value;
  }

  public taskDropdown(value: string): void {
    this.taskID = value;
  }

  public getNewValues(valueDesc: string, valueDate: string, valueStartTime: string, valueEndTime: string, valueTimeSpent: string) {
    this.description = valueDesc;
    this.entryDate = valueDate;
    this.startTime = valueStartTime;
    this.endTime = valueEndTime;
    this.timeSpent = valueTimeSpent
  }

  constructor(
    public dialogRef: MdDialogRef<UpdateDialogComponent>,
    public projectService: ProjectService,
    public taskService: TaskService,
    public timeTrackingEntryService: TimeTrackingEntryService,
    private loginService: LoginService) {
  }

  checkMandatoryFields() {
    if (this.description === "" || this.projectID === null || this.taskID === null || this.entryDate === " " || this.startTime === " ") {
      alert("Please check if all the fields are filled in");
    } else {
      this.checkStartAndEndTime();
    }
  }

  checkStartAndEndTime() {
    if (this.startTime > this.endTime || this.startTime == this.endTime) {
      alert("Please enter a valid endtime.")
    } else {
      this.ok();
    }
  }

  ngOnInit() {
    this.projectService.getProjects().then((projects) => {
      this.projects = projects;
    });
    this.taskService.getTasks().then((tasks) => {
      this.tasks = tasks;
    });
  }

  loadEntries() {
    this.fetch((data) => {
      this.items = data;
    });
  }

  fetch(cb) {
    // this.userID = this.loginService.getLoggedUserID();
    // let url = this.baseUrl + '/timeentries/' + this.userID + '/entries';
    // const req = new XMLHttpRequest();
    // req.open('GET', url);
    this.userID = this.loginService.getLoggedUserID();
    let url = this.baseUrl + '/timeentries/user/' + this.userID;
    const req = new XMLHttpRequest();
    req.open('GET', url);


    // req.onload = () => {
    //   // Get all projects
    //   this.projectService.getProjects().then(result => { this.projects = result; }),

    //     // Get all tasks
    //     this.taskService.getTasks().then(result => { this.tasks = result; }),

    //     // Get user's entries
    //     this.userID = this.loginService.getLoggedUserID(),
    //     this.timeTrackingEntryService.getTimeTrackingEntriesByUser().then((items) => {
    //       this.items = items;
    //     });
    // };
    // req.send();
  }

  public ok() {
    this.taskID = Number(this.taskID);
    this.timeTrackingEntryService.updateTimeTrackingEntry(this.rowID, this.entryDate, this.startTime, this.endTime, this.timeSpent, this.description, this.userprofileID, this.clientID, this.projectID, this.taskID, this.isBillable);
  }
}
