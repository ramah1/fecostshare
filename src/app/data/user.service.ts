import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { environment } from '../../environments/environment';
import { store } from './datastore';
import { IDataservice, IUser } from '.';
import { Router } from '@angular/router';

const RESOURCE_NAME: string = 'user';
const ENDPOINT_NAME: string = '/userprofile';

@Injectable()
export class UserService implements IDataservice {
	public baseUrl: string = environment.apiBaseUrl;
	public loggedIn = false;

	constructor(
		private router: Router,
		private http: Http) {
		// Define a Mapper for a "Project" resource
		store.defineMapper(RESOURCE_NAME, {
			basePath: this.baseUrl,
			endpoint: ENDPOINT_NAME
		});
	}

	public getUser(id: number): Promise<IUser> {
		return store.find(RESOURCE_NAME, id);
	}

	public getUsers(): Promise<IUser[]> {
		let endpoint = ENDPOINT_NAME + '/all';
		return store.findAll(RESOURCE_NAME, {}, {
			endpoint: endpoint,
			force: true
		});
	}

	public updatePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
		let params = new URLSearchParams();
		let url = this.baseUrl + ENDPOINT_NAME;
		params.set('currentPassword', currentPassword);
		params.set('newPassword', newPassword);
		params.set('confirmPassword', confirmPassword);
		return this.http.get(url + "/updatePassword", { search: params });
	}

	public updateUser(id: number, password: string, user: any): Promise<IUser> {
		return store.update(RESOURCE_NAME, id, { password: password, isAdmin: user['admin'], employmentDegree: user['employmentDegree'], username: user['username'] });
	}

	public createUser(username: string, password: string, employmentDegree: number, adminRole: boolean): Promise<IUser>{
		return store.create(RESOURCE_NAME, { userName: username, password: password, employmentDegree: employmentDegree, admin: adminRole },
			{
				endpoint: ENDPOINT_NAME,
				force: true
			});
	}

	public isLoggedIn() {
		return this.loggedIn;
	}
}