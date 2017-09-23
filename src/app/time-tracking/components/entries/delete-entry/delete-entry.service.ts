import { Observable } from 'rxjs/Rx';
import { DeleteEntryComponent } from './delete-entry.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable, ViewContainerRef } from '@angular/core';

@Injectable()
export class DeleteEntryService {

    constructor(private dialog: MdDialog) { }

    public confirm(title: string, message: string, viewContainerRef: ViewContainerRef, id: number): Observable<boolean> {

        let dialogRef: MdDialogRef<DeleteEntryComponent>;
        let config = new MdDialogConfig();
        config.viewContainerRef = viewContainerRef;

        dialogRef = this.dialog.open(DeleteEntryComponent, config);

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;
        dialogRef.componentInstance.rowid = id;

        return dialogRef.afterClosed();
    }
}