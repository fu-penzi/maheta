import { SetClassAfterViewInitDirective } from '@src/app/directives/set-class-after-view-init.directive';

describe('AfterViewInitClassDirective', () => {
  it('should create an instance', () => {
    const directive = new SetClassAfterViewInitDirective();
    expect(directive).toBeTruthy();
  });
});
