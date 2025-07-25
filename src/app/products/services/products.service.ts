import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interface/user.interface';
import {
  Gender,
  Product,
  ProductResponse,
} from '@products/interfaces/product.interface';
import {
  catchError,
  delay,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseURL;
interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProducts: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User,
};

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  private productsCache = new Map<string, ProductResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;
    const key = `${limit}-${offset}-${gender}`;
    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http
      .get<ProductResponse>(`${baseUrl}/products`, {
        params: {
          limit,
          offset,
          gender,
        },
      })
      .pipe(
        //tap((resp) => console.log(resp)),
        tap((resp) => this.productsCache.set(key, resp))
      );
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    if (this.productCache.has(idSlug)) {
      return of(this.productCache.get(idSlug)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`).pipe(
      delay(2000),
      tap((product) => this.productCache.set(idSlug, product))
    );
  }

  getProductById(id: string): Observable<Product> {
    if (id === 'new') {
      return of(emptyProducts);
    }

    if (this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${id}`).pipe(
      delay(2000),
      tap((product) => this.productCache.set(id, product))
    );
  }

  createProduct(
    productLike: Partial<Product>,
    imageFileList?: FileList
  ): Observable<Product> {
    // return this.http
    //   .post<Product>(`${baseUrl}/products`, productLike)
    //   .pipe(tap((product) => this.updateProductCache(product)));
    const currentImage = productLike.images ?? [];

    return this.uploadImages(imageFileList).pipe(
      map((imagesName) => ({
        ...productLike,
        images: [...currentImage, ...imagesName],
      })),
      switchMap((createProduct) =>
        this.http.post<Product>(`${baseUrl}/products`, createProduct)
      ),
      tap((product) => this.updateProductCache(product))
    );
  }

  updateProduct(
    id: string,
    productLike: Partial<Product>,
    imageFileList?: FileList
  ): Observable<Product> {
    const currentImage = productLike.images ?? [];

    return this.uploadImages(imageFileList).pipe(
      map((imagesName) => ({
        ...productLike,
        images: [...currentImage, ...imagesName],
      })),
      switchMap((updateProduct) =>
        this.http.patch<Product>(`${baseUrl}/products/${id}`, updateProduct)
      ),
      tap((product) => this.updateProductCache(product))
    );

    // return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike)
    //   .pipe(tap((product) => this.updateProductCache(product)));
  }

  updateProductCache(product: Product) {
    const productId = product.id;
    this.productCache.set(productId, product);

    this.productsCache.forEach((productsResponse) => {
      productsResponse.products = productsResponse.products.map(
        (currentProduct) => {
          return currentProduct.id === productId ? product : currentProduct;
        }
      );
    });
  }

  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);

    const uploadObservables = Array.from(images).map((imageFiles) =>
      this.uploadImage(imageFiles)
    );

    return forkJoin(uploadObservables).pipe(
      tap((imagesName) => console.log({ images_forkjoin: imagesName }))
    );
  }

  uploadImage(imageFile: File): Observable<string> {
    console.log('📤 Procesando archivo para subir:', imageFile);

    const formData = new FormData();
    formData.append('file', imageFile);

    return this.http
      .post<{ fileName: string }>(`${baseUrl}/files/product`, formData)
      .pipe(
        map((resp) => {
          console.log('✅ Respuesta al subir imagen:', resp);
          return resp.fileName;
        }),
        catchError((error) => {
          // Aquí capturamos el detalle exacto del error
          console.error('❌ Error al subir imagen:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            errorBody: error.error,
            url: error.url,
          });
          // Relanzamos el error para que se pueda manejar más arriba si es necesario
          return throwError(() => error);
        })
      );
  }
}
