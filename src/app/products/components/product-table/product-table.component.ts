import { Component, input } from '@angular/core';
import { Product } from '@products/interfaces/product.interface';
import { productImagePipe } from "../../pipes/product-image.pipe";
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'product-table',
  imports: [productImagePipe, RouterLink, CurrencyPipe],
  templateUrl: './product-table.component.html',
})
export class ProductTableComponent {
  products = input.required<Product[]>();
}
