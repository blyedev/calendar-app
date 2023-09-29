import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringToDate'
})
export class StringToDatePipe implements PipeTransform {

  transform(value: string): Date {
    // Parse the string into a Date object
    const date = new Date(value);

    // Check if the parsing was successful
    if (isNaN(date.getTime())) {
      console.error(`Invalid date format: ${value}`);
      throw new Error('Invalid date format');
    } else {
      return date;
    }
  }
}
