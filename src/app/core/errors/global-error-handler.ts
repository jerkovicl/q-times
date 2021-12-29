/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ErrorHandler, Injectable } from '@angular/core';
import { IResponseError } from '../../core/errors/error.model';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor() {}

  handleError(error: IResponseError): void {
    if (error?.status !== 200) {
      // in prod pass error to notify or logging service
    }
    console.error('Error from global error handler', error);
  }
}
