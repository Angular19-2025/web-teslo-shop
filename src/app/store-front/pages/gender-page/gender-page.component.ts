import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';
import { ProductCardComponent } from "@products/components/product-card/product-card.component";
import { SharedPaginationComponent } from "@shared/components/shared-pagination/shared-pagination.component";
import { PaginationService } from '@shared/components/shared-pagination/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent, SharedPaginationComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {
  route = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);
  gender = toSignal(this.route.params.pipe(map(({ gender }) => gender)));

  productResource = rxResource({
    request: () => ({ gender: this.gender(), page: this.paginationService.currentPage() - 1}),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        gender: request.gender,
        offset: request.page * 9
      });
    },
  });
}
