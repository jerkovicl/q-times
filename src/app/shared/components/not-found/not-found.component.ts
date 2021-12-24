import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  styleUrls: ['./not-found.component.scss'],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  constructor(
    private router: Router // private menuService: NbMenuService
  ) {}

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }
}
