import { DataStore } from 'js-data';
import { HttpAdapter } from 'js-data-http';

export const store = new DataStore();
export const httpAdapter = new HttpAdapter();

// "store" will now use an HTTP adapter by default
store.registerAdapter('http', httpAdapter, { 'default': true });