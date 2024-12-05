import {InjectionToken} from "@angular/core";
import {IMyDate, IMyOptions} from "gramli-angular-mydatepicker";
import moment from "moment/moment";

export class DateFormat {
    public static DATE = 'DD.MM.YYYY';
    public static DATETIME = 'DD.MM.YYYY, HH:mm';
    public static MY_DATE = 'dd.mm.yyyy';
    public static MY_DATETIME = 'dd.mm.yyyy, hh:mm';
}

export const MY_CALENDAR_OPTIONS = new InjectionToken<IMyOptions>('MyCalendarOptions');

const tomorrow = moment().add(1, 'day');
const disableSince: IMyDate = {day: tomorrow.get("date"), month: tomorrow.get("month") + 1, year: tomorrow.get("year")};

export const MY_CALENDAR_DEFAULT_OPTIONS: IMyOptions = {
    dayLabels: {su: 'So', mo: 'Mo', tu: 'Di', we: 'Mi', th: 'Do', fr: 'Fr', sa: 'Sa'},
    monthLabels: { 1: 'Jan', 2: 'Feb', 3: 'Mär', 4: 'Apr', 5: 'Mai', 6: 'Jun',
        7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Okt', 11: 'Nov', 12: 'Dez' },
    inline: false,
    dateFormat: DateFormat.MY_DATE,
    disableSince: disableSince
};
