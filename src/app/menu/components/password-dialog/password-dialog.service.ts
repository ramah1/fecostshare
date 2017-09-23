import { Observable } from 'rxjs/Rx';
import { Injectable, ViewContainerRef } from '@angular/core';
import { PasswordDialogComponent } from './password-dialog.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { UserService } from '../../../data';

@Injectable()
export class PasswordDialogService {

  constructor(private dialog: MdDialog, public userService: UserService) { }

  public confirm(title: string, viewContainerRef: ViewContainerRef): Observable<boolean> {

  	let dialogRef: MdDialogRef<PasswordDialogComponent>;
    let config = new MdDialogConfig();
    config.viewContainerRef = viewContainerRef;

    dialogRef = this.dialog.open(PasswordDialogComponent, config);

    dialogRef.componentInstance.title = title;

    return dialogRef.afterClosed();
  }
}