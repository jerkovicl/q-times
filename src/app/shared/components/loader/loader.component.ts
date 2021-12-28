import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LoaderService } from 'src/app/core/loader.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  public loading!: boolean;

  constructor(private loaderService: LoaderService) {
    this.loaderService.isLoading.pipe(untilDestroyed(this)).subscribe((v: boolean) => {
      //  console.log(v);
      this.loading = v;
    });
  }
  ngOnInit(): void {}
}
