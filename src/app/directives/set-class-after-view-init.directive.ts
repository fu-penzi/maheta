import { AfterViewInit, Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[mahetaSetClassAfterViewInit]',
})
export class SetClassAfterViewInitDirective implements AfterViewInit {
  @Input('mahetaSetClassAfterViewInit') class: string;

  @HostBinding('class') bindClass: string = 'sdadd';
  public ngAfterViewInit(): void {
    this.bindClass = this.class;
  }
}
