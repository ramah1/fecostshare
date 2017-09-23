import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ProjectService, TaskService, TimeTrackingEntryService, UserService, IProject, ITask, ITimeTrackingEntry, IUser, IStatistics } from '../data';
// Use the Full path instead of using index.ts path
import { CreateDialogService } from '../time-tracking/components/create-dialog/create-dialog.service';
import { ExportDialogService } from '../time-tracking/components/export-dialog/export-dialog.service';
import { EditDialogService } from '../time-tracking/components/edit-dialog/edit-dialog.service';
import { EntriesService } from '../time-tracking/components/entries/entries.service';

import { Router } from '@angular/router';
import moment from 'moment/src/moment';

@Component({
  selector: 'app-time-tracking',
  templateUrl: './time-tracking.component.html',
  styleUrls: ['./time-tracking.component.scss']
})
export class TimeTrackingComponent implements OnInit {

  public isLoading: Boolean = false;

  private projects: IProject[];
  private project: IProject;
  private tasks: ITask[];
  private entries: ITimeTrackingEntry[];
  private entry: ITimeTrackingEntry;
  private user: IUser;
  private users: IUser[];
  private statistics: IStatistics;
  public currentDate: any;


  constructor(
    private dialog: MdDialog,
    private projectService: ProjectService,
    private taskService: TaskService,
    private createDialogService: CreateDialogService,
    private exportDialogService: ExportDialogService,
    private editDialogService: EditDialogService,
    private userService: UserService,
    private router: Router,
    private viewContainerRef: ViewContainerRef,
    private entriesService: EntriesService) {
  }

  ngOnInit() {
    this.isLoading = false;
    this.currentDate = moment().format('LL');
    this.checkIfLoggedIn();
  }
  public openCreateDialog() {
    this.createDialogService
      .confirm('Create', this.viewContainerRef)
      .subscribe(res => {
        if (res) {
          //this.entriesService.loadEntries();
        }
      });
  }

  public openEditDialog() {
    this.editDialogService
      .confirm('Edit', this.viewContainerRef)
      .subscribe(res => {
        if (res) {

        }
      });
  }

  public openExportDialog() {
    this.exportDialogService
      .confirm('Export', this.viewContainerRef);
  }

  checkIfLoggedIn() {
    if (localStorage.getItem('Authorization')) {
    }
    else {
      this.router.navigate(['']);
    }
  }
}
