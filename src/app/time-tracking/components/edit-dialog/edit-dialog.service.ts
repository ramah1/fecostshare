import { Observable } from 'rxjs/Rx';
import { Injectable, ViewContainerRef } from '@angular/core';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { EditDialogComponent } from './edit-dialog.component';
import {RegistryService } from '../../../data';

@Injectable()
export class EditDialogService {

  constructor(private dialog: MdDialog, 
  	public registryService: RegistryService) { }

  public confirm(title: string, viewContainerRef: ViewContainerRef): Observable<boolean>{
  	let dialogRef: MdDialogRef<EditDialogComponent>;
  	let config = new MdDialogConfig();
  	config.viewContainerRef = viewContainerRef;

  	dialogRef = this.dialog.open(EditDialogComponent, config);
  	dialogRef.componentInstance.title = title;

  	return dialogRef.afterClosed();
  }

}
