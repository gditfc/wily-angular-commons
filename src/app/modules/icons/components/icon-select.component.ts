import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { IconsService } from '../services/icons.service';

/**
 * Wily Icon Select component provides a button to click and an icon picker that includes all of the Wily Icons as well as the FAS icons.
 */
@Component({
  selector: 'wily-icon-select',
  templateUrl: 'icon-select.component.html',
  styleUrls: ['./icon-select.component.css']
})
export class IconSelectComponent {

  /**
   * The number of items to display per page
   * @private
   */
  private static readonly PAGE_SIZE = 50;

  /**
   * Color class of the button
   */
  @Input()
  buttonColorClass = 'overlay_alt2 page_container_color';

  /**
   * The value to set to the button's width, min-width, height and min-height
   */
  @Input()
  buttonSizing = '40px';

  /**
   * Icon select opened event emitter
   */
  @Output()
  opened = new EventEmitter<void>();

  /**
   * Icon selected event emitter
   */
  @Output()
  selected: EventEmitter<any> = new EventEmitter();

  /**
   * Dialog closed event emitter
   */
  @Output()
  closed = new EventEmitter<any>();

  /**
   * BehaviorSubject tracking the current filter value selection for icons
   */
  readonly _filter = new BehaviorSubject< {
    style: 'all' | 'solid' | 'regular' | 'light' | 'brands',
    type: 'all' | 'wily' | 'fontawesome'
  }>({ style: 'all', type: 'all' });

  /**
   * BehaviorSubject tracking the current icon search text value
   */
  readonly _searchText = new BehaviorSubject('');

  /**
   * BehaviorSubject that emits when search button has been clicked
   */
  readonly _searchClick = new BehaviorSubject('');

  /**
   * BehaviorSubject tracking the active pagination page
   */
  readonly _activePage = new BehaviorSubject(0);

  /**
   * An array of all icons (as strings) that meet the current filter/search criteria as an Observable
   * @private
   */
  private readonly icons$: Observable<Array<{ prefix: string, name: string }>> = combineLatest([
    this._filter,
    this._searchClick
  ]).pipe(
    map(([filter, searchText]) => this.service.getIcons(
      filter.type,
      filter.style,
      searchText
    ))
  );

  /**
   * The count of total paginator pages as an Observable
   */
  readonly totalPages$: Observable<number> = this.icons$.pipe(
    map(icons => icons.length
      ? Math.ceil(icons.length / IconSelectComponent.PAGE_SIZE)
      : 0
    )
  );

  /**
   * Observable boolean indicating whether or not the user can perform an icon text search
   */
  readonly canSearch$: Observable<boolean> = this._searchText.pipe(
    map(searchText => !!searchText.trim().length)
  );

  /**
   * Observable boolean indicating whether or not the user can paginate to the previous page
   */
  readonly canPaginatePrevious$: Observable<boolean> = this._activePage.pipe(
    map(activePage => activePage > 0)
  );

  /**
   * Observable boolean indicating whether or not the user can paginate to the next page
   */
  readonly canPaginateNext$: Observable<boolean> = this.totalPages$.pipe(
    withLatestFrom(this._activePage),
    map(([totalPages, activePage]) => activePage < (totalPages - 1))
  );

  /**
   * Paginated icons array as an Observable
   */
  readonly paginatedIcons$: Observable<Array<{ prefix: string, name: string }>> = combineLatest([
    this._activePage,
    this.icons$
  ]).pipe(
    map(([activePage, icons]) => {
      let paginatedIcons: Array<{ prefix: string, name: string }> = null;

      if (activePage >= 0 && icons.length) {
        paginatedIcons = icons.slice(
          IconSelectComponent.PAGE_SIZE * activePage,
          IconSelectComponent.PAGE_SIZE * (activePage + 1)
        );
      }

      return paginatedIcons;
    })
  );

  /**
   * Object that controls whether to show the dialog or not
   */
  showDialog: any;

  /**
   * Filter input for the icon picker.
   */
  filter = '';

  /**
   * List of icons as an object to make lookups easier.
   */
  icons = {};

  /**
   * Class being hovered over
   */
  hoveredClass: string;

  /**
   * Dependency injection site
   * @param service the IconsService
   */
  constructor(private service: IconsService) { }

  /**
   * Open the icon select dialog
   */
  openDialog(): void {
    this.reset();
    this.showDialog = {};
    this.opened.emit();
  }

  /**
   * Close the icon select dialog
   */
  closeDialog(): void {
    this.showDialog = null;
    this.closed.emit();
  }

  /**
   * Handle filter select
   * @param filter the selected filter
   */
  handleFilterSelect(
    filter: { style: 'all' | 'solid' | 'regular' | 'light' | 'brands',
    type: 'all' | 'wily' | 'fontawesome' }
  ): void {
    this._filter.next(filter);
    this._activePage.next(0);
  }

  /**
   * Go to the next pagination page
   */
  paginateNext(): void {
    this._activePage.next(this._activePage.getValue() + 1);
  }

  /**
   * Go to the previous pagination page
   */
  paginatePrevious(): void {
    this._activePage.next(this._activePage.getValue() - 1);
  }

  /**
   * Reset filtering/pagination BehaviorSubject values
   * @private
   */
  private reset(): void {
    this._filter.next({ style: 'all', type: 'all' });
    this._searchText.next('');
    this._activePage.next(0);
  }
}
