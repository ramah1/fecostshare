import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Http } from '@angular/http';
import { IUser, UserService, ITimeTrackingEntry, IProject, ITask, IClient, TaskService, ProjectService, TimeTrackingEntryService, ClientService, RegistryService } from '../../../data';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { EntryDialogService } from './entry-dialog/entry-dialog.service';
import { DeleteEntryService } from './delete-entry/delete-entry.service';
//import { UpdateDialogService } from './update-dialog/update-dialog.service';
import { UpdateDialogComponent } from './update-dialog/update-dialog.component';
import { LoginService } from '../../../login';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import moment from 'moment/src/moment';
import { EntriesService } from './entries.service';
import { CreateDialogService } from '../create-dialog/create-dialog.service';
// import { SearchDialogComponent } from './components/search-dialog/search-dialog.component';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss']
})
export class EntriesComponent implements OnInit {
  public baseUrl: string = environment.apiBaseUrl;

  @Input() projects: IProject[] = [];
  @Input() project: IProject;
  @Input() tasks: ITask[] = [];
  @Input() task: ITask;
  @Input() clients: IClient[] = [];
  @Input() client: IClient;
  @Input() users: IUser[] = [];
  public isLoading: Boolean = false;
  public items: ITimeTrackingEntry[] = [];
  rows = [];
  selected = [];
  selectedRow: any;
  cloneSelectedRow: any;
  timeTrackingEntry: ITimeTrackingEntry;
  editMode: boolean = false;
  rowID: number;
  userID: number;
  clientID: any;
  projectID: any;
  taskID: any;
  isBillable: boolean;
  selectedDescription: string;
  count: number = 0;
  @Input() offset: number = 0;
  // columns: any;
  @Input() date: string;

  public tasksDictionary: any = {};
  public projectsDictionary: any = {};
  public clientsDictionary: any = {};

  public editing = {};
  public result: any;
  private limits = [
    { key: 'All Entries', value: 50 },
    { key: '10 Entries', value: 10 },
    { key: '5 Entries', value: 5 }
  ];

  limit: number = this.limits[0].value;
  rowLimits: Array<any> = this.limits;

  public createItems = [
    { key: 'None', id: 1 },
    { key: 'Client', id: 2 },
    { key: 'Project', id: 3 },
    { key: 'Task', id: 4 }
  ];
  item: number = this.createItems[0].id;
  public defaultItem: any;

  public NONE: number = 0;
  public CLIENT: number = 2;
  public PROJECT: number = 3;
  public TASK: number = 4;

  @Input() selectedClients: any;
  @Input() selectedProjects: any;
  @Input() selectedTasks: any;
  @Input() itemTotalTimeSpent: any;

  constructor(
    public projectService: ProjectService,
    public timeTrackingEntryService: TimeTrackingEntryService,
    public taskService: TaskService,
    public clientService: ClientService,
    private entryDialogService: EntryDialogService,
    private deleteEntryService: DeleteEntryService,
    //private updateDialogService: UpdateDialogService,
    private viewContainerRef: ViewContainerRef,
    private loginService: LoginService,
    public userService: UserService,
    private dialog: MdDialog,
    private http: Http,
    private router: Router,
    public registryService: RegistryService,
    public entriesService: EntriesService) {
    this.registryService.entriesComponent = this;
  }

  ngOnInit() {
    this.defaultItem = this.createItems[0].key;
    this.loadEntries();
  }

  filterEntries() {
    var userSelectedProjects = [];
    var userSelectedTasks = [];
    var userSelectedClients = [];

    let filteredEntries: ITimeTrackingEntry[];

    // Handle if no project is seleted
    if (this.selectedProjects) {
      this.selectedProjects.forEach(selectionIndex => {
        userSelectedProjects.push(selectionIndex);
      });
    }
    // Handle if no task is seleted
    if (this.selectedTasks) {
      this.selectedTasks.forEach(selectionIndex => {
        userSelectedTasks.push(selectionIndex);
      });
    }
    // Handle if no client is seleted
    if (this.selectedClients) {
      this.selectedClients.forEach(selectionIndex => {
        userSelectedClients.push(selectionIndex);
      });
    }
    // We get all the entries
    filteredEntries = this.entriesService.clonedItems;

    // We filter by project
    filteredEntries = filteredEntries.filter(function (timeEntry) {
      let entryProjectId = timeEntry.projectID.valueOf();
      // Does the current entryProjectId belong to user selected projects in the filter 
      return (userSelectedProjects.indexOf(entryProjectId) != -1);
    });

    // We filter by task
    filteredEntries = filteredEntries.filter(function (timeEntry) {
      let entryTaskId = timeEntry.taskID.valueOf();
      return (userSelectedTasks.indexOf(entryTaskId) != -1);
    });

    // We filter by client
    filteredEntries = filteredEntries.filter(function (timeEntry) {
      let entryClientId = timeEntry.clientID.valueOf();
      return (userSelectedClients.indexOf(entryClientId) != -1);
    });

    // We assign the result to the table datasource
    this.items = filteredEntries;
    this.itemTotalTimeSpent = this.totalTimeSpent(this.items);
  }

  // Calcul total time spent
  public totalTimeSpent(entries) {
    let endTimeH: number = 0;
    let endTimeMin: number = 0;
    let hour: number = 0;
    let timeSpent: any;
    for (let entry of entries) {
      endTimeH = endTimeH + parseInt(entry.timeSpent.substring(0, 2));
      endTimeMin = endTimeMin + parseInt(entry.timeSpent.substring(3, 5));
    }

    // Handle conversion Minute over 60mn to 1h
    if (endTimeMin > 60) {
      hour = Math.round(endTimeMin / 60);
      endTimeH = endTimeH + hour;
      endTimeMin = Math.abs(endTimeMin - (60 * hour));
      if ((endTimeH.toString()).length < 2 && (endTimeMin.toString()).length < 2) {
        timeSpent = '0' + endTimeH + ':0' + endTimeMin;
      }
      else if ((endTimeH.toString()).length < 2) {
        timeSpent = '0' + endTimeH + ':' + endTimeMin;
      }
      else if ((endTimeMin.toString()).length < 2) {
        timeSpent = endTimeH + ':0' + endTimeMin;
      } else {
        timeSpent = endTimeH + ':' + endTimeMin;
      }
      return timeSpent;
    }
    // Handle Minute below 60mn
    else {
      if ((endTimeH.toString()).length < 2 && (endTimeMin.toString()).length < 2) {
        timeSpent = '0' + endTimeH + ':0' + endTimeMin;
      }
      else if ((endTimeH.toString()).length < 2) {
        timeSpent = '0' + endTimeH + ':' + endTimeMin;
      }
      else if ((endTimeMin.toString()).length < 2) {
        timeSpent = endTimeH + ':0' + endTimeMin;
      } else {
        timeSpent = endTimeH + ':' + endTimeMin;
      }
      return timeSpent;
    }
  }

  changeRowLimits(event) {
    this.limit = event.target.value;
    this.offset = 0;
    this.loadEntries();
  }

  public clientDropdown(value: string): void {
    this.clientID = value;
  }

  public projectDropdown(value): void {
    this.projectID = value;
  }

  public taskDropdown(value: string): void {
    this.taskID = value;
  }

  updateValue(event, cell, cellValue, row) {
    this.editing[row.$$index + '-' + cell] = false;

    if (cell == 'description') {
      row.description = event.target.value;
      this.updateEntry(row);
    }

    if (cell == 'client') {
      row.clientID = event.target.value;
      this.http.get(this.baseUrl + "/clients/" + event.target.value).subscribe(res => {
        row.client = res;
        return this.updateEntry(row);
      });
    }

    if (cell == 'project') {
      row.projectID = event.target.value;
      this.http.get(this.baseUrl + "/projects/" + event.target.value).subscribe(res => {
        row.project = res;
        return this.updateEntry(row);
      });
    }

    if (cell == 'task') {
      row.taskID = event.target.value;
      this.http.get(this.baseUrl + "/tasks/" + event.target.value).subscribe(res => {
        row.task = res;
        return this.updateEntry(row);
      });
    }

    if (cell == 'date') {
      let selectedDate = event.target.value.substring(8, 10) + "." + event.target.value.substring(5, 7) + "." + event.target.value.substring(0, 4);
      row.entryDate = selectedDate;
      this.updateEntry(row);
    }

    if (cell == 'startTime') {
      row.startTime = event.target.value;
      if (row.startTime > row.endTime || row.startTime == row.endTime) {
        row.startTime = cellValue;
        alert("Start time should be less than end time.");
      }
      else {
        row.timeSpent = this.calculateSpentTime(row);
        this.updateEntry(row);
      }
    }

    if (cell == 'endTime') {
      row.endTime = event.target.value;
      if (row.startTime > row.endTime || row.startTime == row.endTime) {
        row.endTime = cellValue;
        alert("Start time should be less than end time.");
      }
      else {
        row.timeSpent = this.calculateSpentTime(row);
        this.updateEntry(row);
      }
    }
  }

  public updateEntry(row) {
    this.http.put(this.baseUrl + "/timeentries/" + row.id, {
      entryDate: row.entryDate,
      startTime: row.startTime,
      endTime: row.endTime,
      timeSpent: row.timeSpent,
      description: row.description,
      userprofileID: row.userprofileID,
      clientID: row.clientID,
      projectID: row.projectID,
      taskID: row.taskID,
      billable: row.isBillable
    }).subscribe(
      () => {
        this.loadEntries();
      });
  }

  onSelect({ selected }) {
    if (selected) {
      this.selectedRow = selected[0];
    }
  }

  public calculateSpentTime(row) {
    let timeSpent: string;
    let timeSpentH: number;
    let timeSpentMin: number;
    let startTimeH: number = parseInt(row.startTime.substring(0, 2));
    let startTimeMin: number = parseInt(row.startTime.substring(3, 5));

    let endTimeH: number = parseInt(row.endTime.substring(0, 2));
    let endTimeMin: number = parseInt(row.endTime.substring(3, 5));
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

  isSelected(row) {
    if (this.selectedRow != null && this.selectedRow.id == row.id) {
      return true;
    }
    return false;
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  discardChange() {
    this.selectedRow.description = this.cloneSelectedRow.description;
    this.toggleEditMode();
  }

  updateRowPosition() {
    let ix = this.getSelectedIx();
    let arr = [...this.rows];
    arr[ix - 1] = this.rows[ix];
    arr[ix] = this.rows[ix - 1];
    this.rows = arr;
  }

  getSelectedIx() {
    return this.selected[0]['$$index'];
  }

  public openDialog() {
    this.entryDialogService
      .confirm('New Entry', this.viewContainerRef)
      .subscribe(res => {
        this.result = res;
        if (this.result) {
          this.loadEntries();
        }
      });
  }

  public openDeleteDialog(row) {
    this.deleteEntryService
      .confirm('Delete', 'Are you sure you want to delete this entry?', this.viewContainerRef, row.id)
      .subscribe(res => {
        this.result = res;
        if (this.result) {
          this.loadEntries();
        }
      });
  }

  loadEntries() {
    this.entriesService.entriesAreLoaded().then(results => {
      this.items = results;

      this.clients = this.entriesService.clients.sort(this.registryService.propComparator('clientName'));
      this.projects = this.entriesService.projects.sort(this.registryService.propComparator('projectName'));
      this.tasks = this.entriesService.tasks.sort(this.registryService.propComparator('taskDescription'));

      // Set itemTotalTimeSpent per default
      this.itemTotalTimeSpent = this.totalTimeSpent(this.items);

      // Set md-select true per default
      this.selectedProjects = this.projects.map(function (project) {
        return project.id;
      });
      this.selectedTasks = this.tasks.map(function (task) {
        return task.id;
      });
      this.selectedClients = this.tasks.map(function (client) {
        return client.id;
      });
    });
  }

  onPage(event) {
    console.log('Page Event', event);
    this.count = this.items.length;
    this.items = this.entriesService.clonedItems;
    const start = event.offset * event.limit;
    const end = start + Number(event.limit);
    let rows = [];
    for (let i = start; i < end; i++) {
      rows[i] = this.items[i];
    }
    this.items = rows;
    this.items.length = this.count;
    console.log('Page Results', start, end, rows);
    this.offset = event.offset;
  }

  private getStatistics() {
    // TODO
    // this.statistics.totalAvailableVacationDays = 18;
    // this.statistics.totalHousWorkedMonth = 69;
    // this.statistics.totalHousWorkedWeek = 21;
  }

  public showSearchDialog() {
    // this.dialogRefSearch = this.dialog.open(SearchDialogComponent);

    // this.dialogRefSearch
    //   .afterClosed()
    //   .subscribe(result => {
    //     this.dialogRefSearch = null;
    //   });
  }

  public showExportDialog() {
    // TODO
  }

  public showVacationWorkedHoursDialog() {
    // TODO
  }
}