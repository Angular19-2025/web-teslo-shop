import { SlicePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/product.interface';
import { productImagePipe } from "../../pipes/product-image.pipe";

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe, productImagePipe],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  product = input.required<Product>();

  imageUrl = computed(()=> {
    return `http://localhost:3000/api/files/product/${this.product().images[0]}`;
  });
}
