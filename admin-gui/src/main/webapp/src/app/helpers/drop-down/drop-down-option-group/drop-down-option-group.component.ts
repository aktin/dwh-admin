import {Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'drop-down-option-group',
    templateUrl: './drop-down-option-group.component.html',
    styleUrl: './drop-down-option-group.component.less',
    host: {
        'class': 'ui horizontal divider group'
    },
    encapsulation: ViewEncapsulation.None
})
export class DropDownOptionGroupComponent {
    @Input()
    public label: string;
}
