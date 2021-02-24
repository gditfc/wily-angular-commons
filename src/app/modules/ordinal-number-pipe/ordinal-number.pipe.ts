import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to transform an input number into its ordinal format
 */
@Pipe({
  name: 'ordinalNumber'
})
export class OrdinalNumberPipe implements PipeTransform {

  /**
   * Transform the input number/string (must be a valid number if string)
   * into Ordinal format (1 -> 1st, 2 -> 2nd, etc)
   * @param value the number to transform
   */
  transform(value: number | string): string {
    let stringifiedNumber: string;
    if (typeof value === 'string' && !isNaN(Number(value))) {
      stringifiedNumber = value;
    } else if (typeof value === 'number') {
      stringifiedNumber = String(value);
    }

    let ordinalSuffix: string;
    if (stringifiedNumber.endsWith('11') ||
        stringifiedNumber.endsWith('12') ||
        stringifiedNumber.endsWith('13')
    ) {
      ordinalSuffix = 'th';
    } else if (stringifiedNumber.endsWith('1')) {
      ordinalSuffix = 'st';
    } else if (stringifiedNumber.endsWith('2')) {
      ordinalSuffix = 'nd';
    } else if (stringifiedNumber.endsWith('3')) {
      ordinalSuffix = 'rd';
    } else {
      ordinalSuffix = 'th';
    }

    return stringifiedNumber + ordinalSuffix;
  }
}
