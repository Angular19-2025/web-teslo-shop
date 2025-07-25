import { Component, computed, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './shared-pagination.component.html',
})
export class SharedPaginationComponent {
  page = input(0);
  currentPage = input<number>(1);
  activePage = linkedSignal(this.currentPage);

  getPageList = computed(() => {
    return Array.from({ length: this.page()}, (_, i)=> i + 1);
  });

}
