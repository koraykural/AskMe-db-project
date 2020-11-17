import { Injectable } from '@angular/core';
import { TimeagoDefaultFormatter } from 'ngx-timeago';

@Injectable()
export class CustomTimeagoFormatter extends TimeagoDefaultFormatter {
  constructor() {
    super();
  }

  format(then: number): string {
    if (Date.now() - then < 60 * 1000) {
      return 'Just now';
    }
    return super.format(then);
  }
}
