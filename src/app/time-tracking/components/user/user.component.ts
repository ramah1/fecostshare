import { Component, Input } from '@angular/core';
import { LoginService } from '../../../login';
import { IUser } from '../../../data';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss']
})
export class UserComponent {
	private currentUser;
	isLoggedIn: boolean = false;
	@Input() username: string;

	constructor(
		private loginService: LoginService) {
	}

	public isLogged() {
		this.showData();
		return this.isLoggedIn = this.loginService.isLoggedIn();
	}

	public showData() {
		this.currentUser = this.loginService.getUser();
	}
}