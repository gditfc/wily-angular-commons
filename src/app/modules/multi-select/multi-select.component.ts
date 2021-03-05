import {animate, keyframes, style, transition, trigger} from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MultiSelectOption} from './models/multi-select-option.model';
import {MultiSelectOptionGroup} from './models/multi-select-option-group.model';

/**
 * Type representing the dropdown component option input
 */
declare type DropdownOptionInput = Array<MultiSelectOption | MultiSelectOptionGroup>;

/**
 * Dropdown component
 * TODO: close animation
 */
@Component({
  selector: 'wily-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.css'],
  animations: [
    trigger('openClose', [
      transition('closed => open', [
        animate('200ms ease', keyframes([
          style({
            opacity: 0,
            transform: 'scaleY(0.5)',
            offset: 0
          }),
          style({ opacity: 0, offset: .25 }),
          style({ opacity: 1, transform: 'scaleY(1)', offset: 1 })
        ]))
      ])
    ])
  ],
})
export class MultiSelectComponent implements ControlValueAccessor, OnInit {

  /**
   * Set the value of the dropdown
   * @param value the value to set
   */
  @Input()
  set value(value: Array<string | number>) {
    this._value = value;
    this._internalValue.next(value);
  }
  get value() { return this._value; }

  /**
   * The dropdown options/option groups
   */
  @Input('options')
  set setOptions(options: DropdownOptionInput) {
    this._options.next(MultiSelectComponent.sanitizeOptionInput(options));
  }

  /**
   * The amount of offset (in pixels) to place between the dropdown
   * and its list overlay
   * @private
   */
  private static readonly LIST_OFFSET = 0;

  /**
   * List of arrow key keycodes
   * @private
   */
  private static readonly ARROW_KEYS = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'];

  /**
   * ViewChild of the dropdown
   */
  @ViewChild('dropdown')
  dropdown: ElementRef<HTMLDivElement>;

  /**
   * ViewChild of the dropdown button
   */
  @ViewChild('dropdownButton')
  dropdownButton: ElementRef<HTMLButtonElement>;

  /**
   * ViewChild of the dropdown list
   */
  @ViewChild('dropdownList')
  dropdownList: ElementRef<HTMLDivElement>;

  /**
   * QueryList of dropdown option ViewChildren
   */
  @ViewChildren('dropdownOption')
  dropdownOptions: QueryList<ElementRef<HTMLButtonElement>>;

  /**
   * ContentChild of the dropdown option template
   */
  @ContentChild(TemplateRef)
  template: TemplateRef<HTMLElement>;

  /**
   * Whether or not the dropdown should be disabled
   */
  @Input()
  disabled: boolean;

  /**
   * Placeholder text to display when no option is selected
   */
  @Input()
  placeholder = 'Make a selection...';

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
   * BehaviorSubject tracking the input dropdown options/option groups
   */
  readonly _options = new BehaviorSubject<DropdownOptionInput>(null);

  /**
   * BehaviorSubject tracking the current value of the dropdown
   */
  readonly _internalValue = new BehaviorSubject<Array<number | string>>(null);

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
              dataContextMap[String(groupOption.value)] = JSON.parse(JSON.stringify(groupOption.dataContext));
            }
          } else if ('dataContext' in option) {
            dataContextMap[String(option.value)] = JSON.parse(JSON.stringify(option.dataContext));
          }
        }
      }

      return dataContextMap;
    })
  );

  /**
   * Observable map of stringified option value to boolean indicating the user's selections
   */
  readonly selectionValueMap$: Observable<{ [key: string]: boolean }> = this._internalValue.pipe(
    map(values => {
      const selectionValueMap = {};

      if (!!values?.length) {
        for (const value of values) {
          selectionValueMap[String(value)] = true;
        }
      }

      return selectionValueMap;
    })
  );

  /**
   * Observable boolean indicating if the input values array is defined and non-empty
   */
  readonly hasSelections$: Observable<boolean> = this._internalValue.pipe(
    map(values => !!values?.length)
  );

  /**
   * Unique ID to assign to the dropdown
   */
  readonly multiSelectId;

  /**
   * Whether or not the dropdown is open
   */
  opened = false;

  /**
   * The index of the focused option in the dropdown list
   */
  selectionIndex: number;

  /**
   * The current value of the dropdown
   * @private
   */
  private _value: Array<string | number>;

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
        const validOptions: Array<MultiSelectOption> = [];
        for (const groupOption of (option.options ?? [])) {
          if (!!groupOption.label && (!!groupOption.value || (groupOption.value >= 0))) {
            const groupOptionCopy = JSON.parse(JSON.stringify(groupOption));
            groupOptionCopy.dataContext = this.addLabelToDataContext(groupOptionCopy.label, groupOptionCopy.dataContext);

            validOptions.push(groupOptionCopy);
          }
        }

        if (!!validOptions.length) {
          sanitizedOptions.push({ groupLabel: option.groupLabel, options: validOptions });
        }
      } else if (('label' in option) && ('value' in option)) {
        if (!!option.label && (!!option.value || (option.value >= 0))) {
          const optionCopy = JSON.parse(JSON.stringify(option));
          optionCopy.dataContext = this.addLabelToDataContext(optionCopy.label, optionCopy.dataContext);

          sanitizedOptions.push(optionCopy);
        }
      }
    }

    return sanitizedOptions;
  }

  /**
   * Add option label to data context if not present. If $implicit
   * value is not present, it will be added with the label as its value.
   * If $implicit is already present, it will add a label key to the context
   * @param label the option label
   * @param dataContext the option data context
   * @private
   */
  private static addLabelToDataContext(label: string, dataContext: { [key: string]: unknown }): { [key: string]: unknown } {
    if (!dataContext) {
      dataContext = {};
    }

    if (!!label) {
      const implicitValue = dataContext['$implicit'];

      if (!!implicitValue || implicitValue >= 0) {
        const labelExists = !!dataContext['label'];

        if (!labelExists) {
          dataContext['label'] = label;
        }
      } else {
        dataContext['$implicit'] = label;
      }
    }

    return dataContext;
  }

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
   * @param renderer the Angular renderer
   * @param changeDetectorRef reference to the Angular change detector
   */
  constructor(private renderer: Renderer2, private changeDetectorRef: ChangeDetectorRef) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    this.multiSelectId = `multiselect-${result}${new Date().getTime()}`;
  }

  /**
   * Init component
   */
  ngOnInit(): void { }

  /**
   * If the input value is already in the value array, remove it. Otherwise add it
   * @param value the value to write
   */
  writeValue(value: string | number): void {
    if (!this.value) {
      this.value = [value];
    } else {
      const valueCopy = [...this.value];
      const foundIndex = valueCopy.findIndex(item => item === value);

      if (foundIndex > -1) {
        valueCopy.splice(foundIndex, 1);
      } else {
        valueCopy.push(value);
      }

      this.value = valueCopy;
    }

    this.changeDetectorRef.markForCheck();
    this.change.emit();
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
   * Prevent default behavior for arrow key keydown event
   * @param event the keydown KeyboardEvent
   */
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (document.activeElement?.id?.includes(this.multiSelectId) && !this.disabled) {
      const { key } = event;

      if (MultiSelectComponent.ARROW_KEYS.includes(key)) {
        event.preventDefault();
      }
    }
  }

  /**
   * Close the dropdown list on escape keyup
   * @param event the keyup KeyboardEvent
   */
  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    if (document.activeElement?.id?.includes(this.multiSelectId) && !this.disabled) {
      const {key} = event;

      if (MultiSelectComponent.ARROW_KEYS.includes(key)) {
        this.onArrowKeyUp(key);
      } else {
        if (this.opened) {
          if (key === 'Esc' || key === 'Escape') {
            this.closeDropdown();
            this.dropdownButton.nativeElement.focus();
          } else if (key === 'Tab') {
            this.closeDropdown();
          }
        }
      }
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
          this.dropdownButton.nativeElement.focus();
        }
      }
    }
  }

  /**
   * Set focus to dropdown option on mouse enter and update selected index
   * @param option the dropdown option to focus
   * @param index the index of the option to focus
   */
  onDropdownOptionMouseEnter(option: HTMLButtonElement, index: number): void {
    this.selectionIndex = index;
    option.focus();
  }

  /**
   * Set focus to dropdown option on mouse move and update selected index
   * @param option the dropdown option to focus
   * @param index the index of the option to focus
   */
  onDropdownOptionMouseMove(option: HTMLButtonElement, index: number): void {
    if (this.selectionIndex !== index) {
      this.selectionIndex = index;
      option.focus();
    }
  }

  /**
   * Write value and close dropdown on option select
   * @param value the value to write
   * @param disabled whether or not the selected option is disabled
   */
  onDropdownOptionSelect(value: string | number, disabled: boolean): void {
    if (!disabled) {
      this.writeValue(value);
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
      this.resizeDropdownList();

      setTimeout(() => {
        const option = this.getNextOption();
        if (!!option) {
          option.focus();
        }
      });

      /*
        The height of the dropdown list is zero at the point where the above code executes,
        this is a workaround to align the list after its height is known to avoid a frame
        or two of the list at origin
       */
      this.renderer.setStyle(this.dropdownList.nativeElement, 'top', '-999px');
      this.renderer.setStyle(this.dropdownList.nativeElement, 'left', '-999px');
      setTimeout(() => this.positionDropdownList());
    }
  }

  /**
   * Close the dropdown list
   */
  closeDropdown(): void {
    this.opened = false;
    this.selectionIndex = null;
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
    const offsetListHeight = offsetHeight + MultiSelectComponent.LIST_OFFSET;
    let transformOrigin: string, positionTop: string;

    if (availableBottomSpace > offsetListHeight) {
      transformOrigin = 'top left';
      positionTop = `${datePickerBottomLeftAnchor + MultiSelectComponent.LIST_OFFSET}px`;
    } else if (availableTopSpace > offsetListHeight) {
      transformOrigin = 'bottom left';
      positionTop = `${top - offsetListHeight}px`;
    } else {
      if (offsetHeight > window.innerHeight) {
        positionTop = '0px';
      } else {
        const availableSpace = window.innerHeight - offsetHeight;
        positionTop = String(availableSpace / 2);
      }

      transformOrigin = 'top left';
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

  /**
   * Handle arrow keyup event
   * @param key the arrow key
   */
  private onArrowKeyUp(key: string): void {
    if (key === 'ArrowLeft' || key === 'ArrowUp') {
      const previousOption = this.getPreviousOption();

      if (previousOption !== null) {
        if (this.opened) {
          previousOption.focus();
        } else {
          this.writeValue(previousOption.getAttribute('data-value'));
        }
      }
    } else if (key === 'ArrowRight' || key === 'ArrowDown') {
      const nextOption = this.getNextOption();

      if (nextOption !== null) {
        if (this.opened) {
          nextOption.focus();
        } else {
          this.writeValue(nextOption.getAttribute('data-value'));
        }
      }
    }
  }

  /**
   * Get the next enabled dropdown option (relative to the current selection index).
   * If the currently selected option is the final available option, it is
   * returned. If no selection has been made, the first available option is returned
   * @private
   */
  private getNextOption(): HTMLButtonElement {
    const optionsArray = this.dropdownOptions.toArray();

    const startIndex = this.selectionIndex === null ? 0 : this.selectionIndex + 1;
    for (let i = startIndex; i < optionsArray.length; i++) {
      const option = optionsArray[i].nativeElement;

      if (!option.disabled) {
        this.selectionIndex = i;
        break;
      }
    }

    return this.selectionIndex === null
      ? null
      : optionsArray[this.selectionIndex].nativeElement;
  }

  /**
   * Get the previous enabled dropdown option (relative to the current selection index).
   * If the currently selected option is the first available option, it is
   * returned
   * @private
   */
  private getPreviousOption(): HTMLButtonElement {
    let previousOption: HTMLButtonElement = null;

    if (this.selectionIndex !== null) {
      const optionsArray = this.dropdownOptions.toArray();

      for (let i = this.selectionIndex - 1; i >= 0; i--) {
        const option = optionsArray[i].nativeElement;

        if (!option.disabled) {
          this.selectionIndex = i;
          previousOption = option;
          break;
        }
      }
    }

    return previousOption;
  }
}
