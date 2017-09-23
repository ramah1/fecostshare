import { Component, OnInit, Input, Renderer } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { IProject, ITask, IUser, ProjectService, TaskService, UserService, IClient, ClientService, RegistryService } from '../../../data';
import { LoginService } from '../../../login';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Rx';
import { EntriesService } from '../../components/entries/entries.service';
import { EntriesComponent } from '../../components/entries/entries.component';
import { CreateDialogService } from './create-dialog.service';

@Component({
	selector: 'app-create-dialog',
	templateUrl: './create-dialog.component.html',
	styleUrls: ['./create-dialog.component.scss']
})
export class CreateDialogComponent implements OnInit {
	public baseUrl: string = environment.apiBaseUrl;

	@Input() projects: IProject[] = [];
	@Input() tasks: ITask[] = [];
	@Input() clients: IClient[] = [];
	public title: string;
	public newTaskDescription: string;
	public newProjectName: string;
	public newClientName: string;
	public user;
	public projectID: any;
	public clientID: any;
	public username: string;
	public password: string;
	public confirmPassword: string;
	public employmentDegree: number;
	public adminRole: boolean;

	editMode: boolean = false;
	public TASK: number = 1;
	public PROJECT: number = 2;
	public CLIENT: number = 3;
	public USER: number = 4;
	public result: any;
	private isAdmin: boolean;

	public createItems = [
		{ key: 'Task', id: 1 },
		{ key: 'Project', id: 2 },
		{ key: 'Client', id: 3 },
		{ key: 'User', id: 4 }
	];

	public item: number = this.createItems[0].id;

	constructor(
		public dialogRef: MdDialogRef<CreateDialogComponent>,
		public projectService: ProjectService,
		public taskService: TaskService,
		public userService: UserService,
		public loginService: LoginService,
		public clientService: ClientService,
		private http: Http,
		private router: Router,
		public entriesService: EntriesService,
		public registryService: RegistryService
	) { }

	ngOnInit() {

	}

	changeItemToBeCreated(event) {
		this.item = event.target.value;
	}

	toggleEditMode() {
		this.editMode = !this.editMode;
	}

	public validateForm(valueDesc: string, valueProjName: string, valueClient: string, valueUsername: string, valuePassw: string, valueConfirmPass: string, valueEmploy: number, valueIsAdmin: any) {
		this.newTaskDescription = valueDesc;
		this.newProjectName = valueProjName;
		this.newClientName = valueClient;
		this.username = valueUsername;
		this.password = valuePassw;
		this.confirmPassword = valueConfirmPass;
		this.employmentDegree = valueEmploy;
		this.adminRole = valueIsAdmin.checked;
	}

	public checkMandatoryFields() {
		if (this.item == this.PROJECT) {
			if (this.newProjectName === "" || this.newProjectName === undefined) {
				alert("Please check if all the fields are filled in");
			} else {
				this.createItem();
			}
		}
		if (this.item == this.TASK) {
			if (this.newTaskDescription === "" || this.newTaskDescription === undefined) {
				alert("Please check if all the fields are filled in");
			} else {
				this.createItem();
			}
		}
		if (this.item == this.CLIENT) {
			if (this.newClientName === "" || this.newClientName === undefined) {
				alert("Please check if all the fields are filled in");
			} else {
				this.createItem();
			}
		}
		if (this.item == this.USER) {
			if (this.username === "" || this.password === "" || this.confirmPassword === "" || this.employmentDegree === undefined || this.adminRole === undefined) {
				alert("Please check if all the fields are filled in");
			}
			else if (this.password.length < 8) {
				alert("Password length should be at least 9 !");
			}
			else if (this.password !== this.confirmPassword) {
				alert("Passwords are not the same !")
			}
			else if (!(this.employmentDegree <= 1 && this.employmentDegree > 0)) {
				alert("Employment degree should be between 0.10 and 1.0 !");
			}
			else {
				this.createItem();
			}
		}
	}

	public checkIfAdmin() {
		this.showData();
		return this.isAdmin = this.loginService.isAdmin();
	}

	public showData() {
		this.user = this.loginService.getUser();
	}

	public createItem() {
		if (this.item == this.PROJECT) {
			return this.http.post(this.baseUrl + "/projects", {
				projectName: this.newProjectName
			}).subscribe(() => {
				this.dialogRef.close(true);
				this.registryService.entriesComponent.loadEntries();
			},
				error => {
					if (error.response.status === 400 || error.response.status === 404) {
						alert('Please check that fields are the correct input !');
						return Observable.of(undefined);
					}
					if (error.response.status === 500) {
						alert('Internal server error !')
					}
				});
		}

		if (this.item == this.TASK) {
			return this.http.post(this.baseUrl + "/tasks", {
				description: this.newTaskDescription
			}).subscribe(() => {
				this.dialogRef.close(true);
				this.registryService.entriesComponent.loadEntries();
			},
				error => {
					if (error.response.status === 400 || error.response.status === 404) {
						alert('Please check that fields are the correct input !');
						return Observable.of(undefined);
					}
					if (error.response.status === 500) {
						alert('Internal server error !')
					}
				});
		}

		if (this.item == this.CLIENT) {
			return this.http.post(this.baseUrl + "/clients", {
				clientName: this.newClientName
			}).subscribe(() => {
				this.dialogRef.close(true);
				this.registryService.entriesComponent.loadEntries();
			},
				error => {
					if (error.response.status === 400 || error.response.status === 404) {
						alert('Please check that fields are the correct input !');
						return Observable.of(undefined);
					}
					if (error.response.status === 500) {
						alert('Internal server error !')
					}
				});
		}

		if (this.item == this.USER) {
			return this.http.post(this.baseUrl + "/userprofile",
				{
					userName: this.username,
					password: this.password,
					employmentDegree: this.employmentDegree,
					admin: this.adminRole
				}).map(res => res.json())
				.subscribe(
				(data) => {
					this.dialogRef.close(true);
					this.registryService.entriesComponent.loadEntries();
				},
				(error) => {
					if (error.status === 400 || error.status === 404) {
						alert('Please check that fields are the correct input !');
					}
					if (error.status === 409) {
						alert('User already exists !');
					}
					if (error.status === 500) {
						alert('Internal server error !')
					}
				});
		}
	}

	public keyDownFunction(event) {
		if (event.key == 'Enter') {
			this.checkMandatoryFields();
		}
	}

	private displayItems() {
		if (!this.checkIfAdmin()) {
			this.createItems.splice(1);
			this.createItems.splice(2);
			this.createItems.splice(3);
		}
	}
}
