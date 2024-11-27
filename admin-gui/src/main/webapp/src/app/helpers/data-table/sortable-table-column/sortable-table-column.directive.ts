import {Directive, EventEmitter, HostBinding, HostListener, Input, Output} from '@angular/core';
import {SortEvent} from "./sort-event";

@Directive({
  selector: 'th[sortableTableColumn]'
})
export class SortableTableColumnDirective {
  @Input()
  public identifier: string;

  @HostBinding('class')
  public direction: 'ascending' | 'descending' | null = null;

  @HostBinding('class.sorted')
  private get isSorted(): boolean {
    return !!this.direction;
  }

  @Output()
  public sort: EventEmitter<SortEvent> = new EventEmitter<SortEvent>();

  @HostListener('click', ['$event'])
  private onSort(): void {
    this.direction = this.direction === 'descending' ? 'ascending' : 'descending';
    this.sort.emit({identifier: this.identifier, direction: this.direction});
  }
}
