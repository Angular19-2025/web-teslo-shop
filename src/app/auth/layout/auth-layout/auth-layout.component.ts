import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.component.html',
})
export class AuthLayoutComponent {
   pageTitle = '';

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        map(() => {
          // buscamos la ruta activa más profunda
          let current = this.route.firstChild;
          while (current?.firstChild) {
            current = current.firstChild;
          }
          // ahora sacamos la propiedad `title` del route config
          return current?.routeConfig?.title ?? 'Autenticación';
        })
      )
      .subscribe(title => (this.pageTitle = title as string));
  }
}
