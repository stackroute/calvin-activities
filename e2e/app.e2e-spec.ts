import { CalvinActivitiesPage } from './app.po';

describe('calvin-activities App', () => {
  let page: CalvinActivitiesPage;

  beforeEach(() => {
    page = new CalvinActivitiesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
