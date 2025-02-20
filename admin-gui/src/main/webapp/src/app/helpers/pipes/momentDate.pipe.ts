import {Pipe, PipeTransform} from '@angular/core';
import moment from 'moment';

/**
 * Transforms a timestamp into a string that has the given format.
 * (Workaround because angular datepipe is not displaying the desired format correctly in IE)
 */
@Pipe({name: 'momentDate'})
export class MomentDatePipe implements PipeTransform {
    transform(value: any, format: string = ''): string {
        if(!value) return "";
        let momentDate = moment.unix(value);
        if (!momentDate.isValid()) {
            return value;
        }
        return momentDate.format(format);
    }
}
