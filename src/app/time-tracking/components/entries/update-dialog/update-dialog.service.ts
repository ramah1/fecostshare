import { Observable } from 'rxjs/Rx';
import { Injectable, ViewContainerRef } from '@angular/core';
import { UpdateDialogComponent } from './update-dialog.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { ITimeTrackingEntry } from '../../../../data';

@Injectable()
export class UpdateDialogService {

    constructor(private dialog: MdDialog) { }

    public confirm(viewContainerRef: ViewContainerRef, row: any): Observable<boolean> {

        let dialogRef: MdDialogRef<UpdateDialogComponent>;
        let config = new MdDialogConfig();
        config.viewContainerRef = viewContainerRef;

        dialogRef = this.dialog.open(UpdateDialogComponent, config);

        dialogRef.componentInstance.selectedDescription = row.description;
        dialogRef.componentInstance.selectedProject = row.projectID;
        dialogRef.componentInstance.rowID = row.id;
        dialogRef.componentInstance.userprofileID = row.userprofileID;
        dialogRef.componentInstance.projectID = row.projectID;
        dialogRef.componentInstance.taskID = row.taskID;
        dialogRef.componentInstance.selectedTask = row.taskID;
        dialogRef.componentInstance.selectedDate = row.entryDate;
        dialogRef.componentInstance.selectedStartTime = row.startTime;
        dialogRef.componentInstance.selectedEndTime = row.endTime;
        dialogRef.componentInstance.selectedTimeSpent = row.timeSpent;

        return dialogRef.afterClosed();
    }
}