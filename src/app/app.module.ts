import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { HttpModule, Http, Response, RequestOptions, Headers, XHRBackend } from '@angular/http';
import { MaterialModule, MdDatepickerModule, MdNativeDateModule, DateAdapter, MdAutocompleteModule } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AlertModule, ModalModule, TimepickerModule, TabsModule, DatepickerModule, TypeaheadModule } from 'ng2-bootstrap';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { ProjectService, TaskService, TimeTrackingEntryService, UserService, ClientService, RegistryService } from './data';
import { SidebarComponent, 
        EntriesComponent, 
        TimeTrackingComponent, 
        EntryDialogComponent, 
        EntryDialogService, 
        DeleteEntryComponent, 
        DeleteEntryService, 
        UpdateDialogComponent, 
        UpdateDialogService, 
        CreateDialogComponent, 
        CreateDialogService, 
        ExportDialogComponent, 
        ExportDialogService, 
        EntriesService, 
        EditDialogComponent, 
        EditDialogService } from './time-tracking';
import { routes } from './routes';
import { LoginComponent, LoginService } from './login';
import { HttpInterceptor, httpFactory } from './httpCalls';
import { UserComponent } from './time-tracking/components/user/user.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MyDatePickerModule } from 'mydatepicker';
import { CryptoJS } from 'crypto-js';
import { MenuComponent, PasswordDialogComponent, PasswordDialogService } from './menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeDateAdapter } from './dateAdapter';
@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        // SearchDialogComponent,
        ExportDialogComponent,
        SidebarComponent,
        EntriesComponent,
        TimeTrackingComponent,
        EntryDialogComponent,
        DeleteEntryComponent,
        UpdateDialogComponent,
        UserComponent,
        MenuComponent,
        PasswordDialogComponent,
        CreateDialogComponent,
        EditDialogComponent
    ],
    entryComponents: [
        EntryDialogComponent,
        DeleteEntryComponent,
        UpdateDialogComponent,
        PasswordDialogComponent,
        CreateDialogComponent,
        ExportDialogComponent,
        EditDialogComponent
    ],
    imports: [
        NgxDatatableModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot(routes, {useHash: true}),
        MaterialModule,
        FlexLayoutModule,
        AlertModule,
        ModalModule,
        TimepickerModule,
        TabsModule,
        TypeaheadModule,
        MyDatePickerModule,
        BrowserAnimationsModule,
        MdDatepickerModule,
        MdNativeDateModule,
        MdAutocompleteModule
    ],
    providers: [
        ProjectService,
        TaskService,
        TimeTrackingEntryService,
        UserService,
        LoginService,
        EntryDialogService,
        DeleteEntryService,
        UpdateDialogService,
        PasswordDialogService,
        ClientService,
        CreateDialogService,
        ExportDialogService,
        EntriesService,
        RegistryService,
        EditDialogService,
        {
            provide: Http,
            useFactory: httpFactory,
            deps: [XHRBackend, RequestOptions]
        },
        {
            provide: DateAdapter,
            useClass: DeDateAdapter
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('fr-CH');
  }
 }
platformBrowserDynamic().bootstrapModule(AppModule);