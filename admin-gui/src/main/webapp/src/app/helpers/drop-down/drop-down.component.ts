import {
    AfterViewInit,
    Component,
    ContentChildren,
    ElementRef,
    Input,
    QueryList,
    ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {DropDownOptionComponent} from "./drop-down-option/drop-down-option.component";

declare var $: any;

// Wrapper for semantic ui drop down
@Component({
    selector: 'drop-down',
    templateUrl: './drop-down.component.html',
    styleUrl: './drop-down.component.css',
    providers: [{provide: NG_VALUE_ACCESSOR, useExisting: DropDownComponent, multi: true}],
})
export class DropDownComponent<T> implements ControlValueAccessor, AfterViewInit {
    public selected: T = null;
    public isDisabled: boolean = false;

    @ViewChild('dropdown')
    private dropdown: ElementRef<HTMLDivElement>;

    @ContentChildren(DropDownOptionComponent)
    private options: QueryList<DropDownOptionComponent>;

    @Input()
    public compare: (a: T, b: T) => boolean = (a, b) => a === b;

    ngAfterViewInit(): void {
        // init semantic / fomantic ui jquery plugin
        $(this.dropdown.nativeElement).dropdown();

        this.options.changes.subscribe(o => this.setOption(this.selected))
    }

    writeValue(value: T): void {
        this.selected = value;

        this.setOption(value);
    }

    registerOnChange(fn: (value: T) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    public onElementChange($event: Event) {
        const inputElement = <HTMLInputElement>$event.target;
        const option = this.options.map(o => o).find(o => o.i === Number.parseInt(inputElement.value));
        this.selected = option.value;
        this.onChange(option.value);
        this.onTouched();
    }

    private onChange: (value: T) => void = () => {
    };

    private onTouched: () => void = () => {
    };

    private setOption(value: T): void {
        const i = this.options?.find(o => this.compare(o.value, value))?.i;
        // need to set the initial selection explicitly in a timeout,
        // otherwise the dropdown menu will not notice that a value has changed
        setTimeout(() => $(this.dropdown.nativeElement).dropdown('set selected', i), 100);
    }
}
