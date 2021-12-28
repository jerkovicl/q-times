import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { SearchComponent } from 'src/app/shared/components/search/search.component';
import { LoaderComponent } from './components/loader/loader.component';

const sharedComponents = [HeaderComponent, NotFoundComponent, SearchComponent, LoaderComponent];
const sharedModules = [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, NgbModule];

@NgModule({
  declarations: [...sharedComponents],
  imports: [...sharedModules],
  exports: [...sharedComponents, ...sharedModules],
  providers: [],
})
export class SharedModule {}
