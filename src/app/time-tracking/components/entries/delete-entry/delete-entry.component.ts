import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { TimeTrackingEntryService } from '../../../../data';
import { Http } from '@angular/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-delete-entry',
  templateUrl: './delete-entry.component.html',
  styleUrls: ['./delete-entry.component.scss']
})
export class DeleteEntryComponent implements OnInit {
  public baseUrl: string = environment.apiBaseUrl;

  public title: string;
  public message: string;
  public rowid: number;

  constructor(public dialogRef: MdDialogRef<DeleteEntryComponent>,
    public timeTrackingEntryService: TimeTrackingEntryService,
    private http: Http) {
  }

  public deleteEntry() {
    this.http.delete(this.baseUrl + "/timeentries/" + this.rowid).map(res => res.json()).subscribe(
      () => {
        this.dialogRef.close(true);
      });
  }

  ngOnInit() {
  }
}
