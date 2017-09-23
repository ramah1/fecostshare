import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { environment } from '../../environments/environment';
import { store } from '../data/datastore';
import { IDataservice, TimeTrackingEntryService, ITimeTrackingEntry, IUser, UserService } from '../data';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import * as CryptoJS from 'crypto-js';

const RESOURCE_NAME: string = 'user';
const ENDPOINT_NAME: string = '/login';

@Injectable()
export class LoginService implements IDataservice {
	private user: IUser;

	public baseUrl: string = environment.apiBaseUrl;

	public loggedUserID: number;
	public headers: Headers;

	constructor(
		private http: Http,
		private timeTrackingEntryService: TimeTrackingEntryService,
		private router: Router,
		private userService: UserService) {
		// Define a Mapper for a "Project" resource
		let resource = store.defineMapper(RESOURCE_NAME, {
			basePath: this.baseUrl,
			endpoint: ENDPOINT_NAME
		});
	}

	public request(username: string, password: string) {
		let params = new URLSearchParams();
		let url = this.baseUrl + ENDPOINT_NAME;
		params.set('username', username);
		params.set('password', password);
		return this.http.get(url, { search: params }).map(res => res.json()).subscribe(
			data => {
				localStorage.setItem('Authorization', data.token);
				this.http.get(this.baseUrl + "/userprofile").map(res => res.json()).subscribe(
					user => {
						localStorage.setItem('user', JSON.stringify(user));
						this.router.navigate(['timeentries']);
					},
					() => { }
				);
			},
			error => {
				if (error.status === 400 || error.status === 404) {
					alert('Wrong username or password!!');
				}
				if (error.status === 500) {
					alert('Internal server error!')
				}
			},
		)
	}

	public logout() {
		localStorage.removeItem('Authorization');
		localStorage.removeItem('user');
		this.router.navigate(['']);
	}

	public getUser() {
		return JSON.parse(localStorage.getItem('user'));
	}

	public isLoggedIn() {
		return this.getLoggedUserID() ? true : false;
	}

	public setLoggedUserID(id: number) {
		this.loggedUserID = id;
	}

	public getLoggedUserID(): number {
		let user = this.getUser();
		return user ? parseInt(user.id) : 0;
	}

	public getLoggedUsername() {
		return this.getUser()['userName'];
	}

	public getLoggedPassword() {
		return this.getUser()['password'];
	}

	public isAdmin() {
		return this.getUser()['admin'];
	}
}
