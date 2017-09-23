import { Component, OnInit, Input } from '@angular/core';
import { MdDialogRef, MdDatepickerModule, DateAdapter, MdDateFormats } from '@angular/material';
import { UserService, IClient, ClientService, TimeTrackingEntryService, IUser } from '../../../data';
import { LoginService } from '../../../login';
import moment from 'moment/src/moment';
import { environment } from '../../../../environments/environment';
import { Http } from '@angular/http';
// import { MD_NATIVE_DATE_FORMATS } from "app";
// import { DeDateAdapter } from "app/dateAdapter";

@Component({
	selector: 'app-export-dialog',
	templateUrl: './export-dialog.component.html',
	styleUrls: ['./export-dialog.component.scss']
})

export class ExportDialogComponent implements OnInit {
	public title: string;
	@Input() fromDate: any;
	@Input() toDate: any;
	@Input() myFilter: any;
	public path: string;
	public username: string;
	public userID: any;
	public exportURL: string;
	private user: IUser;
	@Input() users: IUser[] = [];
	public validDatePeriod: boolean;
	public validLength: boolean;
	// deDateAdapter: DeDateAdapter;
	public baseUrl: string = environment.apiBaseUrl;

	constructor(
		public dialogRef: MdDialogRef<ExportDialogComponent>,
		public timeTrackingEntryService: TimeTrackingEntryService,
		public userService: UserService,
		public loginService: LoginService,
		public http: Http,
		public dateAdapter: DateAdapter<Date>) {
			// this.deDateAdapter = new DeDateAdapter();
	}

	ngOnInit() {
		this.loadUsers();
		this.myFilter = (d: Date): boolean => {
			const day = d.getDay();
			// Prevent Saturday and Sunday from being selected.
			return day !== 0 && day !== 6;
		}
	}

	public checkIfAdmin() {
		return this.loginService.isAdmin();
	}

	public userDropdown(value: string): void {
		this.userID = value;
	}

	public readDates(valueFrom: any, valueTo: any) {
		let validFrom = moment(valueFrom._selected).format('L');
		let validTo = moment(valueTo._selected).format('L');
		let fromDate = validFrom.substring(6, 10) + "-" + validFrom.substring(0, 2) + "-" + validFrom.substring(3, 5);
		let toDate = validTo.substring(6, 10) + "-" + validTo.substring(0, 2) + "-" + validTo.substring(3, 5);
		this.fromDate = fromDate;
		this.toDate = toDate;
		this.validDatePeriod = moment(validFrom).isBefore(moment(validTo));
	}

	checkMandatoryFields() {
		if (this.fromDate === "" || this.toDate === "") {
			alert("Please check if all the fields are filled in");
		} else {
			this.checkFromDateAndToDate();
		}
	}

	checkFromDateAndToDate() {
		if (!this.validDatePeriod) {
			alert("Please a valid Period");
		}
		else {
			this.dialogRef.close();
			this.exportEntries();
		}
	}

	loadUsers() {
		this.http.get(this.baseUrl + "/userprofile/all").map(res => res.json()).subscribe(
            results => {
              	this.users = results;
      		});
	}

	refreshExportURL(id) {
		this.exportURL = this.baseUrl + "/export?fromDate=" +
			this.fromDate +
			"&toDate=" +
			this.toDate +
			"&userprofileID=" + id;
		window.open(this.exportURL, '_blank');
	}

	public keyDownFunction(event) {
		if (event.key == 'Enter') {
			this.checkFromDateAndToDate();
		}
	}

	public exportEntries() {
		if (this.checkIfAdmin()) {
			this.refreshExportURL(this.userID);
		}
		else {
			let loggedUserID = this.loginService.getLoggedUserID();
			this.refreshExportURL(loggedUserID);
		}
	}
}