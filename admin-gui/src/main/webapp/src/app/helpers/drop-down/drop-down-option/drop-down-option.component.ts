import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'drop-down-option',
  templateUrl: './drop-down-option.component.html',
  styleUrl: './drop-down-option.component.css',
  host: {
    'class': 'item'
  }
})
export class DropDownOptionComponent<T = any> {
  @Input()
  public value: T;

  protected static counter: number = 0;

  // use i as a unique identifier, since semantic ui drop down uses data-value attribute to store primitive data and is
  // not able to store complex data structures this way
  public i: number = DropDownOptionComponent.counter++;

  @HostBinding('attr.data-value')
  private get dataValue(): number {
    return this.i;
  }
}
