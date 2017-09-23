import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { store } from './datastore';
import { IDataservice, IClient } from '.';

const RESOURCE_NAME: string = 'client';
const ENDPOINT_NAME: string = 'clients';

@Injectable()
export class ClientService {

	public baseUrl: string = environment.apiBaseUrl;

	constructor() {
		// Define a Mapper for a "Task" resource
		store.defineMapper(RESOURCE_NAME, {
			basePath: this.baseUrl,
			endpoint: ENDPOINT_NAME,

			relations: {
				hasMany: {
					entry: {
						foreignKey: 'clientID',
						localField: 'entry'
					}
				}
			}
		});
	}

	// ------------------------------------------------------------------------------ CRUD operations

	public getClients(): Promise<IClient[]> {
		return store.findAll(RESOURCE_NAME, {}, { force: true });
	}

	public getClient(id: number): Promise<IClient> {
		return store.find(RESOURCE_NAME, id);
	}

	public createClient(name: string): Promise<IClient> {
		return store.create(RESOURCE_NAME, { clientName: name });
	}

	public updateClient(id: number, name: string): Promise<IClient> {
		return store.update(RESOURCE_NAME, id, { clientName: name });
	}

	public deleteClient(id: number) {
		return store.destroy(RESOURCE_NAME, id, {
		});
	}
}
