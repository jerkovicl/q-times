import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, Observer } from 'rxjs';
import { LoaderService } from 'src/app/core/loader.service';

@UntilDestroy({ checkProperties: true })
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(private loaderService: LoaderService) {}

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loaderService.isLoading.next(this.requests.length > 0);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.reportProgress) {
      return next.handle(req);
    }
    this.requests.push(req);

    // console.log(`Number of requests--->${this.requests.length}`);

    this.loaderService.isLoading.next(true);
    return new Observable((observer: Observer<HttpEvent<any>>) => {
      next
        .handle(req)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (event: any) => {
            if (event instanceof HttpResponse) {
              this.removeRequest(req);
              observer.next(event);
            }
          },
          error: (err) => {
            alert('error' + err);
            this.removeRequest(req);
            observer.error(err);
          },
          complete: () => {
            this.removeRequest(req);
            observer.complete();
          },
        });
      // remove request from queue when cancelled
      return () => {
        this.removeRequest(req);
      };
    });
  }
}
