import { TimeTrackingComponent, EntriesComponent } from './time-tracking';
import { LoginComponent } from './login';
import { LoggedInGuard } from './logged-in-guard';

export const routes = [
	{ path: 'timeentries', component: TimeTrackingComponent },
	{ path: '', component: LoginComponent }
];