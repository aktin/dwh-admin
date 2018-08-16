import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'durationQuery'})
export class DurationQueryPipe implements PipeTransform {
    transform(isoFormat: string): string {
        let result = '';
        let splits = this.splitIso(isoFormat);
        //console.log(splits);
        if (splits.number === 1) {
            splits.unit === 'D' ? result = 'Täglich' : result = 'Wöchentlich';
       /* } else if (splits.unit === 'W') {
            if (splits.number === 4) {
                result += 'Monatlich';
            } else if (splits.number > 4) {
                result += 'alle ' + (splits.number / 4) + 'Monate';
                if (splits.number % 4 !== 0) {
                    result += ' ' + (splits.number % 4) + ' Wochen';
                }
            }*/
        } else if (splits.unit === 'D') {
            if (splits.number === 7) {
                result += 'Wöchentlich';
            } else if (splits.number > 7) {
                result += 'alle ' + (splits.number / 7) + 'Wochen';
                if (splits.number % 7 !== 0) {
                    result += ' ' + (splits.number % 7) + ' Tage';
                }
            }
        }
      return result;
    }

    // P Num D/M for durationQuery
    splitIso(isoFormat: string) {
        //console.log(isoFormat);
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
      //console.log (isoFormat);
      let result = '';
      let splits = this.splitIso(isoFormat, false);
        if (splits.sign === '+') {
            result += 'nächste';
        } else {
            result += 'vorherige';
        }
        if (splits.number === '1') {
            result += 'r';
        }
        result += ' ' + splits.number;
        if (splits.unit === 'D') {
            result += ' Tag'
        } else if (splits.unit === 'W') {
            result += ' Woche';
            if (splits.number !== '1') {
                result += 'n';
            }
        } else if (splits.unit === 'M') {
            result += ' Monat';
        }
        if (splits.number !== '1' && (splits.unit === 'D' || splits.unit === 'M')) {
            result += 'e';
        }

   return result;
  }

// P -/+ Num D/W/M for durationData
  splitIso(isoFormat: string, query: boolean) {
      let splits = {sign: '', number: '', unit: ''};
      if (isoFormat === 'PT24H') {
        isoFormat = 'P1D';
      }
    if (isoFormat.charAt(1) === '-') {
        splits.sign = '-';
    } else {
        splits.sign = '+';
        isoFormat = isoFormat.slice(0, 1) + '+' + isoFormat.slice(1);
    }
    splits.number = isoFormat.substring(2, isoFormat.length - 1);
    splits.unit = isoFormat.slice(-1);
    return splits;
  }
}
