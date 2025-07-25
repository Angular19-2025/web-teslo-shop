import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/shared-pagination/pagination.service';
import { SharedPaginationComponent } from "@shared/components/shared-pagination/shared-pagination.component";

//import { ProductCardComponent } from "../../../products/components/product-card/product-card.component";

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, SharedPaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  productResource = rxResource({
    request: () => ({ page: this.paginationService.currentPage() - 1 }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        offset: request.page * 9
      });
    },
  });
}
