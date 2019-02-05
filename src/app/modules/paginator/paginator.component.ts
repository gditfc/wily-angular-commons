import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PaginationEvent} from './pagination-event.model';

@Component({
  selector: 'wily-paginator',
  templateUrl: 'paginator.component.html'
})
export class PaginatorComponent {

  @Input()
  version = '1';

  @Input()
  pageSizeOptions: Array<number>;

  @Input()
  pageSize: number;

  @Input()
  totalLength: number;

  @Output()
  paginate: EventEmitter<any> = new EventEmitter();

  activePage: number;
  pageJumpInput = '';

  constructor() {
    this.activePage = 0;
  }

  goToFirst(): void {
    this.goToPage(0);
  }

  goToLast(): void {
    this.goToPage(this.getNumberOfPages() - 1);
  }

  getNumberOfPages(): number {
    return Math.ceil(this.totalLength / this.pageSize);
  }

  goToPage(pageNumber: number): void {
    this.activePage = pageNumber;
    this.emitEvent();
  }

  emitEvent(): void {
    this.paginate.emit(new PaginationEvent(this.activePage, this.pageSize, this.totalLength));
  }

  hasPage(pageNumber: number): boolean {
    if (pageNumber < 0) {
      return false;
    }

    if (pageNumber >= this.getNumberOfPages()) {
      return false;
    }

    return true;
  }

  getStartingValueForPage(pageNumber: number): number {
    return (pageNumber * this.pageSize) + 1;
  }

  getEndingValueForPage(pageNumber: number): number {
    // If it's the last page, return the total length
    if (pageNumber === this.getNumberOfPages() - 1) {
      return this.totalLength;
    }

    return (pageNumber + 1) * this.pageSize;
  }

  pageSizeChange(): void {
    this.goToFirst();
    this.emitEvent();
  }

  jumpPage(): void {
    let page: number =  +this.pageJumpInput;
    page--;

    if (isNaN(page)) {
      this.pageJumpInput = '';
      return;
    }

    if (this.hasPage(page)) {
      this.goToPage(page);
    }

    if (page > this.getNumberOfPages()) {
      this.goToLast();
    }

    if (page <= 0) {
      this.goToFirst();
    }

    this.pageJumpInput = '';
  }

}
