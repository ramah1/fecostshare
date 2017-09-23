import { Observable } from 'rxjs/Rx';
import { Injectable, ViewContainerRef } from '@angular/core';
import { ExportDialogComponent } from './export-dialog.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { TimeTrackingEntryService } from '../../../data';

@Injectable()
export class ExportDialogService {

	constructor(private dialog: MdDialog, public timetrackingService: TimeTrackingEntryService) { }

	public confirm(title: string, viewContainerRef: ViewContainerRef): Observable<boolean> {

		let dialogRef: MdDialogRef<ExportDialogComponent>;
		let config = new MdDialogConfig();
		config.viewContainerRef = viewContainerRef;

		dialogRef = this.dialog.open(ExportDialogComponent, config);

		dialogRef.componentInstance.title = title;

		return dialogRef.afterClosed();
	}
}