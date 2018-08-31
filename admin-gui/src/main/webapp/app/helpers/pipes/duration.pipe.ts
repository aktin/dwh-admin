import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'durationQuery'})
export class DurationQueryPipe implements PipeTransform {
    transform(isoFormat: string): string {
        let result = '';
        let splits = this.splitIso(isoFormat);
        if (splits.number === 1) {
            splits.unit === 'D' ? result = 'Täglich' : result = 'Wöchentlich';
        } else if (splits.unit === 'D') {
            if (splits.number === 7) {
                result += 'Wöchentlich';
            } else if (splits.number % 7 === 0) {
                result += 'alle ' + splits.number / 7 + ' Wochen';
            } else {
                result += 'alle ' + splits.number + ' Tage';
            }
        } else if (splits.unit === 'M') {
            result += 'alle ' + splits.number + ' Monate';
        }
      return result;
    }

    // P Num D/M for durationQuery
    splitIso(isoFormat: string) {
        let splits = {number: 0, unit: ''};
        let addIndex = 0;
        if (isoFormat.substring(0, 2) === 'PT') {
            addIndex = 1;
        }
        splits.number = Number(isoFormat.substring(1 + addIndex, isoFormat.length - 1));
        splits.unit = isoFormat.slice(-1);
        return splits;
    }
}

@Pipe({name: 'durationData'})
export class DurationDataPipe implements PipeTransform {
    transform(isoFormat: string): string {
        let result = '';
        let splits = this.splitIso(isoFormat, false);
        if (splits.unit === 'D') {
            if (splits.number === 7) {
                result += 'eine Woche';
            } else if (splits.number === 1) {
                result += 'ein Tag';
            } else if (splits.number % 7 === 0) {
                result += splits.number / 7 + ' Wochen';
            } else {
                result += splits.number + ' Tage';
            }
        } else if (splits.unit === 'M') {
            if (splits.number === 1) {
                result += 'ein Monat';
            } else {
               result += splits.number + ' Monate';
           }
        } else if (splits.unit === 'W') {
            if (splits.number === 1) {
                result += 'eine Woche';
            } else {
                result += splits.number + ' Wochen';
            }
        }
        if (splits.sign === '+') {
            result += ' ab Referenzdatum';
        } else {
            result += ' vor Referenzdatum';
        }
    return result;
  }

    // P -/+ Num D/W/M for durationData
    splitIso(isoFormat: string, query: boolean) {
        let splits = {sign: '', number: 0, unit: ''};
        if (isoFormat.charAt(1) === '-') {
            splits.sign = '-';
        } else {
            splits.sign = '+';
            isoFormat = isoFormat.slice(0, 1) + '+' + isoFormat.slice(1);
        }
        splits.number = Number(isoFormat.substring(2, isoFormat.length - 1));
        splits.unit = isoFormat.slice(-1);
        return splits;
    }
}
