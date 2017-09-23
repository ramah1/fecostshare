export interface IUser {
	readonly id: number;
	password: string;
	isAdmin: boolean;
	username: string;
	employmentDegree: number;

	// TO DO
	// readonly vacationDays: number;
	// readonly remainingVacationDays: number;
	// readonly hoursWeek: number;
	// readonly hoursMonth: number;
}