import { Component } from '@angular/core';

import { LoginService } from './login.service';
import { Router } from '@angular/router';

// webpack html imports
let template = require('./login.component.html');

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html'
})
export class LoginComponent {
	private username: string;
	private password: string;

	constructor(private loginService: LoginService, private router: Router) {
		let token = localStorage.getItem('Authorization');

		if (token) {
			this.router.navigate(['timeentries']);
		}
	}

	public getUsernamePassword(value: string, value1: string) {
		this.username = value;
		this.password = value1;
	}

	public keyDownFunction(event) {
		if (event.key == 'Enter') {
			this.checkMandatoryFields();
		}
	}

	public checkMandatoryFields() {
		if (this.username === "" || this.password === "") {
			alert("Please check if all the fields are filled in");
		} else {
			this.loginService.request(this.username, encodeURIComponent(this.password));
		}
	}
}
