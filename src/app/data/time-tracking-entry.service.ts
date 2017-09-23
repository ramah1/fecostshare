import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { store } from './datastore';
import { IDataservice, ITimeTrackingEntry, IUser, IProject, ITask } from '.';

const RESOURCE_NAME: string = 'entry';
const ENDPOINT_NAME: string = 'timeentries';

@Injectable()
export class TimeTrackingEntryService implements IDataservice {

  public baseUrl: string = environment.apiBaseUrl;

  constructor() {
    // Define a Mapper for a "Project - User - Task" resource
    store.defineMapper(RESOURCE_NAME, {
      basePath: this.baseUrl,
      endpoint: ENDPOINT_NAME,
      relations: {
        belongsTo: {
          client: {
            localField: 'client',
            foreignKey: 'clientID',
            clientName: 'clientName'
          },
          project: {
            localField: 'project',
            foreignKey: 'projectID',
            projectName: 'projectName'

          },
          task: {
            localField: 'task',
            foreignKey: 'taskID',
            taskDescription: 'taskDescription'
          },
          user: {
            localField: 'user',
            foreignKey: 'userprofileID'
          }
        }
      }
    });
  }

  // ------------------------------------------------------------------------------ CRUD operations

  public getTimeTrackingEntries(): Promise<ITimeTrackingEntry[]> {
    return store.findAll(RESOURCE_NAME, {}, { force: true });
  }

  public getTimeTrackingEntriesByUser(id: number): Promise<ITimeTrackingEntry[]> {
    let endpoint = '/' + ENDPOINT_NAME + '/user/' + id;
    return store.findAll(RESOURCE_NAME, {}, {
      endpoint: endpoint,
      force: true
    });
  }

  public getTimeTrackingEntriesByProject(id: number, item: number): Promise<ITimeTrackingEntry[]> {
    let endpoint = '/' + ENDPOINT_NAME + '/user/' + id + '/project/' + item;
    return store.findAll(RESOURCE_NAME, {item}, {
      endpoint: endpoint,
      force: true
    });
  }
  public getTimeTrackingEntriesByTask(id: number, item: number): Promise<ITimeTrackingEntry[]> {
    let endpoint = '/' + ENDPOINT_NAME + '/user/' + id + '/task/' + item;
    return store.findAll(RESOURCE_NAME, {item}, {
      endpoint: endpoint,
      force: true
    });
  }
  public getTimeTrackingEntriesByClient(id: number, item: number): Promise<ITimeTrackingEntry[]> {
    let endpoint = '/' + ENDPOINT_NAME + '/user/' + id + '/client/' + item;
    return store.findAll(RESOURCE_NAME, {item}, {
      endpoint: endpoint,
      force: true
    });
  }

  public getTimeTrackingEntry(id: number): Promise<ITimeTrackingEntry> {
    return store.find(RESOURCE_NAME, id);
  }

  public deleteTimeTrackingEntry(id: number) {
    return store.destroy(RESOURCE_NAME, id, {
    });
  }

  public updateTimeTrackingEntry(id: number, entryDate: string, startTime: string, endTime: string, timeSpent: string, description: string, userprofileID: number, clientID: number, projectID: number, taskID: number, isBillable: boolean): Promise<ITimeTrackingEntry> {
    return store.update(RESOURCE_NAME, id, { entryDate: entryDate, startTime: startTime, endTime: endTime, timeSpent: timeSpent, description: description, userprofileID: userprofileID, clientID: clientID, projectID: projectID, taskID: taskID, billable: isBillable });
  }

  public createTimeTrackingEntry(entryDate: string, startTime: string, endTime: string, timeSpent: string, description: string, userprofileID: number, clientID: number, projectID: number, taskID: number, isBillable: boolean): Promise<ITimeTrackingEntry> {
    return store.create(RESOURCE_NAME, { entryDate: entryDate, startTime: startTime, endTime: endTime, timeSpent: timeSpent, description: description, userprofileID: userprofileID, clientID: clientID, projectID: projectID, taskID: taskID, billable: isBillable }, { force: true });
  }
}
