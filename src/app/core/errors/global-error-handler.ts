/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ErrorHandler, Injectable } from '@angular/core';
import { ResponseError } from '../../core/errors/error.model';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor() {}

  handleError(error: ResponseError): void {
    if (error?.status !== 200) {
      // this.errorDialogService.openDialog(error?.message || 'Undefined client error');
    }
    console.error('Error from global error handler', error);
  }
}
