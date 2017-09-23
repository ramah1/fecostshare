// import { IClient } from './i-client';
// import { IProject } from './i-project';
// import { ITask } from './i-task';

export interface ITimeTrackingEntry {
    readonly id: number;
    entryDate: string;
    startTime: string;
    endTime: string;
    timeSpent: string;
    description: string;
    userprofileID: number;
    clientID: number;
    clientName: string;
    projectID: number;
    projectName: string;
    taskID: number;
    taskDescription: string;
    isBillable: boolean;
}