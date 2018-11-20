import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'momentDate'})
export class MomentDatePipe implements PipeTransform {
    transform(value: any, format = ''): string {
        let momentDate = moment(value);
        if (!momentDate.isValid()) {
            return value;
        }
        return momentDate.format(format);
    }
}
