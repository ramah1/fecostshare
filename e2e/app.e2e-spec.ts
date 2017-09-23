import { TimetrackerPage } from './app.po';

describe('timetracker App', function() {
  let page: TimetrackerPage;

  beforeEach(() => {
    page = new TimetrackerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
