import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCarrouselComponent } from '@products/components/product-carrousel/product-carrousel.component';
import { Product } from '@products/interfaces/product.interface';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-detail',
  imports: [
    ProductCarrouselComponent,
    ReactiveFormsModule,
    FormErrorLabelComponent,
  ],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  product = input.required<Product>();
  fb = inject(FormBuilder);
  productService = inject(ProductsService);
  router = inject(Router);

  wasSave = signal(false);
  imageFileList: FileList | undefined = undefined;
  tempImages = signal<string[]>([]);
  imagesToCarrousel = computed(()=> {
    const currentProductImage = [...this.product().images, ... this.tempImages()];
    return currentProductImage;
  });

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: [
      '',
      [Validators.required, Validators.pattern(FormUtils.slugPattern)],
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: [
      'women',
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)],
    ],
  });

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    //this.productForm.reset(this.product() as any);
    this.setFormValues(this.product());
  }

  setFormValues(formLike: Partial<Product>) {
    this.productForm.reset(this.product() as any);
    // this.productForm.patchValue(formLike as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') });
  }

  onSizeClicked(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];
    if (currentSizes.includes(size)) {
      currentSizes.slice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes });
  }

  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();
    if (!isValid) return;
    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags:
        formValue.tags
          ?.toLowerCase()
          .split(',')
          .map((tag) => tag.trim()) ?? [],
    };

    if (this.product().id === 'new') {
      //crear nuevo
      const product = await firstValueFrom(
        this.productService.createProduct(productLike, this.imageFileList)
      );

      this.router.navigate(['admin/product', product.id]);
    } else {
      //console.log('productLike.images desde frontend: ', productLike.images);
      const product = await firstValueFrom(

        this.productService.updateProduct(this.product().id, productLike, this.imageFileList)
      );
    }

    this.wasSave.set(true);
    setTimeout(() => {
      this.wasSave.set(false)
    }, 3000);
  }

  onFileChanged(event: Event){
    const files = (event.target as HTMLInputElement).files;
    this.imageFileList = files ?? undefined;

    this.tempImages.set([]);
    const imgUrls = Array.from(files ?? []).map((file) =>
      URL.createObjectURL(file)
    );
    this.tempImages.set(imgUrls);
    //console.log(imgUrls)
  }
}
