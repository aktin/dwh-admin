/**
 * Created by Xu on 03.05.2017.
 */
import { LOCALE_ID } from '@angular/core';
import _ = require('underscore');

export class DateParser {
    public static getMonth(month: number, short = false): string {
        let MonthDe: string[] = [
                'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez',
            ];
        let Month: string[] = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
            ];
        let MonthDeLong: string[] = [
                'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Ockober', 'November', 'Dezember'
            ];
        let  MonthLong: string[] = [
                'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
            ];

        let monthArray = Month;
        switch (LOCALE_ID.toString()) {
            case 'de-DE' :
                if (short) {
                    monthArray = MonthDe;
                } else {
                    monthArray = MonthDeLong;
                }
                break;
            default :
                if (short) {
                    monthArray = Month;
                } else {
                    monthArray = MonthLong;
                }
                break;
        }
        return monthArray[month];
    }
}

