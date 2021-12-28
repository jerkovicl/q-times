import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { LoaderInterceptor } from 'src/app/core/loader.interceptor';
import { LoaderService } from 'src/app/core/loader.service';
import { ErrorHandlerModule } from './errors/error-handler.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, ErrorHandlerModule],
  providers: [
    LoaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
