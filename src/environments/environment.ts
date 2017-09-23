// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,

  title: 'Timetracker - DEV',
  // apiBaseUrl: 'http://localhost:8081'
  // apiBaseUrl: 'http://htmR02.local:8081'
  // apiBaseUrl: 'http://localhost:8080/timetracker'
  apiBaseUrl: 'https://mojito.dev.fluance.net:8443/timetracker'
  // apiBaseUrl: 'http://mojito.dev.fluance.net:8080/timetracker'
};
