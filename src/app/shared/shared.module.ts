import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';

const sharedComponents = [NotFoundComponent];
const sharedModules = [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, NgbModule];

@NgModule({
  declarations: [...sharedComponents],
  imports: [...sharedModules],
  exports: [...sharedComponents, ...sharedModules],
  providers: [],
})
export class SharedModule {}
