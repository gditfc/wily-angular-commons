import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit, Output,
  Renderer2,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {DropdownOption} from './models/dropdown-option.model';
import {DropdownOptionGroup} from './models/dropdown-option-group.model';

/**
 * Type representing the dropdown component option input
 */
declare type DropdownOptionInput = Array<DropdownOption | DropdownOptionGroup>;

/**
 * Dropdown component
 * TODO: accessibility arrow-key controls
 * TODO: make dropdown option (with value/label)
 * TODO: close list on selection
 * TODO: on option select, focus on dropdown button
 * TODO: animation (copy from date-picker)
 */
@Component({
  selector: 'wily-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements ControlValueAccessor, OnInit {

  /**
   * The amount of offset (in pixels) to place between the dropdown
   * and its list overlay
   * @private
   */
  private static readonly DROPDOWN_LIST_OFFSET = 3;

  /**
   * ViewChild of the dropdown
   */
  @ViewChild('dropdown')
  dropdown: ElementRef<HTMLDivElement>;

  /**
   * ViewChild of the dropdown list
   */
  @ViewChild('dropdownList')
  dropdownList: ElementRef<HTMLDivElement>;

  /**
   * ContentChild of the dropdown option template
   */
  @ContentChild(TemplateRef)
  template: TemplateRef<HTMLElement>;

  /**
   * Set the value of the dropdown
   * @param value the value to set
   */
  @Input()
  set value(value: string | number) {
    this._value = value;
    this._internalValue.next(value);
  }
  get value() { return this._value; }

  /**
   * Whether or not the dropdown should be disabled
   */
  @Input()
  disabled: boolean;

  /**
   * The dropdown options/option groups
   */
  @Input('options')
  set setOptions(options: DropdownOptionInput) {
    this._options.next(DropdownComponent.sanitizeOptionInput(options));
  }

  /**
   * Placeholder text to display when no option is selected
   */
  @Input()
  placeholder = 'Make a selection';

  /**
   * Aria label text
   */
  @Input()
  ariaLabel = 'Make a selection';

  /**
   * Class list to assign to the dropdown
   */
  @Input()
  classList: string;

  /**
   * Event emitted on value change
   */
  @Output()
  change = new EventEmitter<void>();

  /**
   * Function to call on change
   */
  onChange: (value: any) => void = () => {};

  /**
   * Function to call on touch
   */
  onTouched: () => any = () => {};

  /**
   * BehaviorSubject tracking the input dropdown options/option groups
   */
  readonly _options = new BehaviorSubject<DropdownOptionInput>(null);

  /**
   * BehaviorSubject tracking the current value of the dropdown
   */
  readonly _internalValue = new BehaviorSubject<number | string>(null);

  /**
   * Observable map of option value (stringified if a number) to data context
   */
  readonly dataContextMap$: Observable<{ [value: string]: { [key: string]: unknown } }> = this._options.pipe(
    map(options => {
      let dataContextMap: { [value: string]: { [key: string]: unknown } } = null;

      if (!!options?.length) {
        dataContextMap = {};

        for (const option of options) {
          if ('options' in option) {
            for (const groupOption of option.options) {
              dataContextMap[String(groupOption.value)] = groupOption.dataContext;
            }
          } else if ('dataContext' in option) {
            dataContextMap[String(option.value)] = option.dataContext;
          }
        }
      }

      return dataContextMap;
    })
  );

  /**
   * Whether or not the dropdown is open
   */
  opened = false;

  /**
   * The current value of the dropdown
   * @private
   */
  private _value: string | number;

  /**
   * Removes options that do not have both a label and a value,
   * also removes empty groups (or groups that have no valid options)
   * @param options the options to sanitize
   * @private
   */
  private static sanitizeOptionInput(options: DropdownOptionInput): DropdownOptionInput {
    const sanitizedOptions: DropdownOptionInput = [];

    for (const option of options) {
      if (('groupLabel' in option) && ('options' in option)) {
        const validOptions: Array<DropdownOption> = [];
        for (const groupOption of (option.options ?? [])) {
          if (!!groupOption.label && (!!groupOption.value || (groupOption.value >= 0))) {
            validOptions.push(groupOption);
          }
        }

        if (!!validOptions.length) {
          sanitizedOptions.push(option);
        }
      } else if (('label' in option) && ('value' in option)) {
        if (!!option.label && (!!option.value || (option.value >= 0))) {
          sanitizedOptions.push(option);
        }
      }
    }

    return sanitizedOptions;
  }

  /**
   * Dependency injection site
   * @param renderer the Angular renderer
   * @param changeDetectorRef reference to the Angular change detector
   */
  constructor(private renderer: Renderer2, private changeDetectorRef: ChangeDetectorRef) { }

  /**
   * Init component
   */
  ngOnInit(): void { }

  /**
   * Write value
   * @param value the value to write
   */
  writeValue(value: string | number): void {
    if (this.value !== value) {
      this.value = value;
      this.changeDetectorRef.markForCheck();

      this.change.emit();
    }
  }

  /**
   * Register function on change
   * @param fn the function to register
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Register function on touch
   * @param fn the function to register
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Set the disabled state
   * @param isDisabled disabled or not
   */
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Reposition and resize the dropdown on window resize
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.opened) {
      this.positionDropdownList();
      this.resizeDropdownList();
    }
  }

  /**
   * Close the dropdown list on escape keyup
   * @param event the keyup KeyboardEvent
   */
  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    const {key} = event;
    if (key === 'Esc' || key === 'Escape' || key === 'Tab') {
      this.closeDropdown();
    }
  }

  /**
   * Close the dropdown list (if opened) on click if outside the list
   * @param event the click MouseEvent
   */
  @HostListener('window:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.opened) {
      const {pageX, pageY} = event;

      if (pageX > 0 && pageY > 0) {
        const { left, right, top, bottom } = this.dropdownList.nativeElement.getBoundingClientRect();
        const xPositionValid = pageX >= left && pageX <= right;
        const yPositionValid = pageY >= top && pageY <= bottom;
        const shouldClose = !(xPositionValid && yPositionValid);

        if (shouldClose) {
          this.closeDropdown();
        }
      }
    }
  }

  /**
   * Open the dropdown list and align it
   * @param event the click MouseEvent
   */
  openDropdown(event: MouseEvent): void {
    event.stopImmediatePropagation();

    if (!this.disabled) {
      this.opened = true;
      this.positionDropdownList();
      this.resizeDropdownList();
    }

  }

  /**
   * Close the dropdown list
   */
  closeDropdown(): void {
    this.opened = false;
  }

  /**
   * Align the dropdown list with the dropdown
   * @private
   */
  private positionDropdownList(): void {
    const {left, top, bottom} = this.dropdown.nativeElement.getBoundingClientRect();
    const {offsetHeight} = this.dropdownList.nativeElement;
    const datePickerBottomLeftAnchor = bottom;
    const availableBottomSpace = window.innerHeight - datePickerBottomLeftAnchor;
    const availableTopSpace = top;
    const offsetListHeight = offsetHeight + DropdownComponent.DROPDOWN_LIST_OFFSET;
    let transformOrigin: string, positionTop: string;

    if (availableBottomSpace > offsetListHeight) {
      transformOrigin = 'top left';
      positionTop = `${datePickerBottomLeftAnchor + DropdownComponent.DROPDOWN_LIST_OFFSET}px`;
    } else if (availableTopSpace > offsetListHeight) {
      transformOrigin = 'bottom left';
      positionTop = `${top - offsetListHeight}px`;
    } else {
      if (offsetHeight > window.innerHeight) {
        positionTop = '0';
      } else {
        const availableSpace = window.innerHeight - offsetHeight;
        positionTop = String(availableSpace / 2);
      }
    }

    this.renderer.setStyle(this.dropdownList.nativeElement, 'transform-origin', transformOrigin);
    this.renderer.setStyle(this.dropdownList.nativeElement, 'left', `${left}px`);
    this.renderer.setStyle(this.dropdownList.nativeElement, 'top', positionTop);
  }

  /**
   * Match the dropdown list width to the dropdown's width
   * @private
   */
  private resizeDropdownList(): void {
    const { left, right } = this.dropdown.nativeElement.getBoundingClientRect();
    const width = right - left;

    this.renderer.setStyle(this.dropdownList.nativeElement, 'width', `${width}px`);
  }
}
