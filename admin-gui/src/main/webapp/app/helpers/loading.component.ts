/**
 * Created by Xu on 03.05.2017.
 */
import { Component, Input } from '@angular/core';

@Component({
    selector: 'loading',
    templateUrl: './loading.component.html',
    styleUrls : ['./loading.component.css'],
})
export class LoadingComponent {
    @Input() message: string;
}
