import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnChanges,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import Swiper from 'swiper';
// import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Navigation, Pagination} from 'swiper/modules';
import { productImagePipe } from "../../pipes/product-image.pipe";

@Component({
  selector: 'product-carrousel',
  imports: [productImagePipe],
  templateUrl: './product-carrousel.component.html',
  styles: `
    .swiper{
      width: 100%;
      height: 500px;
    }
  `,
})
export class ProductCarrouselComponent implements AfterViewInit, OnChanges {
  images = input.required<string[]>();
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');
  swiper : Swiper | undefined = undefined;

  ngAfterViewInit(): void {
    this.swiperIni();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images'].firstChange) {
      return;
    }

    if(!this.swiper) return;

    this.swiper.destroy(true, true);

    const paginationEl: HTMLDivElement = this.swiperDiv().nativeElement?.querySelector('.swiper-pagination');
    paginationEl.innerHTML = '';
    setTimeout(()=>{
    this.swiperIni();
    },100);
  }

  swiperIni(){
     const element = this.swiperDiv().nativeElement;
    if (!element) return;

    //console.log({ element });
    this.swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,

      modules: [Navigation, Pagination],

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }
}
