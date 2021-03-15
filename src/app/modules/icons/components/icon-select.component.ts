import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { IconsService } from '../services/icons.service';

/**
 * Wily Icon Select component provides a button to click and an icon picker that includes all of the Wily Icons as well as the FAS icons.
 */
@Component({
  selector: 'wily-icon-select',
  templateUrl: 'icon-select.component.html',
  styleUrls: ['./icon-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IconSelectComponent),
      multi: true
    }
  ]
})
export class IconSelectComponent implements ControlValueAccessor {

  /**
   * The number of items to display per page
   * @private
   */
  private static readonly PAGE_SIZE = 50;

  /**
   * Set the value of the icon select
   * @param value the value to set
   */
  @Input('value')
  set value(value: string) {
    this._value = value;

    if (value)  {
      const [prefix, name] = value.split(' ');
      this._internalValue.next({ prefix, name });
      this.showIconSelectionPreview = true;
    }
  }

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
   * The scrollable icon container
   */
  @ViewChild('iconScrollContainer')
  iconScrollContainer: ElementRef<HTMLDivElement>;

  /**
   * BehaviorSubject tracking the input value destructed into its prefix and class name
   */
  readonly _internalValue = new BehaviorSubject<{ prefix: string, name: string }>(null);

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
    }),
    tap(() => {
      if (this.iconScrollContainer) {
        this.iconScrollContainer.nativeElement.scrollTop = 0;
      }
    })
  );

  /**
   * Object that controls whether to show the dialog or not
   */
  showDialog: any;

  /**
   * Whether or not to show the icon selection preview
   */
  showIconSelectionPreview = false;

  /**
   * The value of the icon select
   * @private
   */
  private _value: string;

  /**
   * Function to call on change
   */
  onChange: (value: any) => void = () => {};

  /**
   * Function to call on touch
   */
  onTouched: () => any = () => {};

  /**
   * Dependency injection site
   * @param service the IconsService
   * @param changeDetectorRef the Angular ChangeDetectorRef
   */
  constructor(private service: IconsService, private changeDetectorRef: ChangeDetectorRef) { }

  /**
   * Write the input value
   * @param value the value to write
   */
  writeValue(value: string): void {
    this.value = value;
    this.onChange(value);
    this.selected.emit({ value });

    this.changeDetectorRef.markForCheck();
  }

  /**
   * Register onChange function
   * @param fn the function to register
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Register onTouched function
   * @param fn the function to register
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Open the icon select dialog
   */
  openDialog(): void {
    this.reset();
    this.showDialog = {};
    this.opened.emit();

    if (this.value) {
      this.showIconSelectionPreview = true;
    }
  }

  /**
   * Close the icon select dialog
   */
  closeDialog(): void {
    let internalValue = null;
    if (this._value) {
      const [prefix, name] = this._value.split(' ');
      internalValue = { prefix, name };
    }

    this._internalValue.next(internalValue);
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
   * Update internal value on icon select
   * @param icon the selected icon
   */
  handleIconSelect(icon: { prefix: string, name: string }): void {
    this._internalValue.next(icon);
    this.showIconSelectionPreview = false;
    setTimeout(() => this.showIconSelectionPreview = true);
  }

  /**
   * Write value on confirm
   */
  handleIconSelectConfirm(): void {
    const icon = this._internalValue.getValue();
    this.writeValue(`${icon.prefix} ${icon.name}`);
    this.closeDialog();
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
    this._searchClick.next('');
    this._activePage.next(0);
  }
}
