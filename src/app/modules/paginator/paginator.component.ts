import {Component, EventEmitter, Input, Output, OnChanges} from '@angular/core';
import {PaginationEvent} from './pagination-event.model';

/**
 * A Wily paginator, because we hated the other ones on the market.
 */
@Component({
  selector: 'wily-paginator',
  templateUrl: 'paginator.component.html'
})
export class PaginatorComponent implements OnChanges {

  /**
   * Paginator Version to use (1-4 available, 1 is default)
   */
  @Input()
  version = '1';

  /**
   * An array of potential page sizes.
   */
  @Input()
  pageSizeOptions: Array<number>;

  /**
   * Current page size
   */
  @Input()
  pageSize: number;

  /**
   * Total number of items
   */
  @Input()
  totalLength: number;

  /**
   * Event Emitter for pagination or page size change.
   */
  @Output()
  paginate: EventEmitter<any> = new EventEmitter();

  /**
   * Currently active page
   */
  activePage = 0;

  /**
   * For the page jump text input
   */
  pageJumpInput = '';

  /**
   * Number of pages
   */
  numberOfPages: number;

  /**
   * Recalculate number of pages on input change
   */
  ngOnChanges(): void {
    this.numberOfPages = this.getNumberOfPages();
  }

  /**
   * Goes to the first page
   */
  goToFirst(): void {
    this.goToPage(0);
  }

  /**
   * Goes to the last page
   */
  goToLast(): void {
    this.goToPage(this.getNumberOfPages() - 1);
  }

  /**
   * Calculates the number of pages
   */
  getNumberOfPages(): number {
    return Math.ceil(this.totalLength / this.pageSize);
  }

  /**
   * Goes to a given page and emits a pagination event
   *
   * @param pageNumber
   * @param inputFocus
   */
  goToPage(pageNumber: number, inputFocus?: boolean): void {
    this.activePage = pageNumber;

    if (inputFocus) {
      document.getElementById('activePage').focus();
    }

    this.emitEvent();
  }

  /**
   * Emits a pagination event with the current paginator data
   */
  emitEvent(): void {
    this.paginate.emit(new PaginationEvent(this.activePage, this.pageSize, this.totalLength));
  }

  /**
   * Determines whether a given page exists or not.
   *
   * @param pageNumber
   */
  hasPage(pageNumber: number): boolean {
    if (pageNumber < 0) {
      return false;
    }

    return !(pageNumber >= this.getNumberOfPages());
  }

  /**
   * Gets the first value for a given page
   *
   * @param pageNumber
   */
  getStartingValueForPage(pageNumber: number): number {
    return (pageNumber * this.pageSize) + 1;
  }

  /**
   * Gets the last value for a given page
   *
   * @param pageNumber
   */
  getEndingValueForPage(pageNumber: number): number {
    // If it's the last page, return the total length
    if (pageNumber === this.getNumberOfPages() - 1) {
      return this.totalLength;
    }

    return (pageNumber + 1) * this.pageSize;
  }

  /**
   * When a page size is changed, go back to the first page and emit a pagination event
   */
  pageSizeChange(): void {
    this.goToFirst();
  }

  /**
   * Jump to a page based on user input
   */
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
