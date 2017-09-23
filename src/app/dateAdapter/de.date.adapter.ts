import { NativeDateAdapter } from '@angular/material';

export class DeDateAdapter extends NativeDateAdapter {
  parse(value: any): Date | null {
    if ((typeof value === 'string') && (value.indexOf('.') > -1)) {
      const str = value.split('.');
      return new Date(Number(str[2]), Number(str[1]) - 1, Number(str[0]), 12);
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }
}
