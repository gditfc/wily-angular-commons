import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Component that wraps the native HTML5 color picker for supported browsers
 */
@Component({
  selector: 'wily-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true
    }
  ]
})
export class ColorPickerComponent implements ControlValueAccessor, OnInit {

  /**
   * Regex to match a hexadecimal string (000000)
   * @private
   */
  private static readonly FULL_HEX_REGEX = new RegExp('^[0-9A-Fa-f]{6}$');

  /**
   * Regex to match a short hexadecimal string (000)
   * @private
   */
  private static readonly SHORT_HEX_REGEX = new RegExp('^[0-9A-Fa-f]{3}$');

  /**
   * Regex to match a valid hex character (A-F, a-f, 0-9)
   * @private
   */
  private static readonly HEX_CHARACTER_REGEX = new RegExp('^[0-9A-Fa-f]$');

  /**
   * Navigation keys
   * @private
   */
  private static readonly NAVIGATION_KEYS = [
    'Enter', 'Esc', 'Escape', 'Tab', 'Shift',
    'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown',
    'Backspace', 'Delete'
  ];

  /**
   * Set the value of the color picker
   * @param value the value to set
   */
  @Input('value')
  set value(value: string) {
    let hexString = value ?? '';

    if (hexString) {
      ColorPickerComponent.FULL_HEX_REGEX.lastIndex = 0;
      ColorPickerComponent.SHORT_HEX_REGEX.lastIndex = 0;

      hexString = hexString.replace('#', '').toLowerCase();

      if (ColorPickerComponent.SHORT_HEX_REGEX.test(hexString)) {
        hexString = ColorPickerComponent.expandShortHexString(hexString);
      }

      if (!ColorPickerComponent.FULL_HEX_REGEX.test(hexString)) {
        hexString = '';
      }
    }

    this._value = hexString;

    if (this.colorInput) {
      this.colorInput.nativeElement.value = this._value;
    }
  }

  /**
   * Set disabled
   * @param disabled whether or not the control should be disabled
   */
  @Input('disabled')
  set disabled(disabled: boolean) {
    this._disabled = disabled;
  }

  /**
   * Aria label input
   */
  @Input()
  ariaLabel = 'Color picker';

  /**
   * Class list to apply to the hex string input
   */
  @Input()
  classList: string;

  /**
   * Event emitted on hex string input event. Emits the current value of the input
   */
  @Output()
  input = new EventEmitter<string>();

  /**
   * ViewChild of the color input element
   */
  @ViewChild('colorInput')
  colorInput: ElementRef<HTMLInputElement>;

  /**
   * Whether or not to render the component
   */
  render: boolean;

  /**
   * Whether or not the native HTML5 color picker is supported
   */
  colorPickerSupported: boolean;

  /**
   * The value of the color picker
   */
  _value = '';

  /**
   * Whether or not the color picker is disabled
   * @private
   */
  _disabled = false;

  /**
   * Expand a short hex string (#abc) into its full form (#aabbcc)
   * @param hexString the short hex string to expand
   * @private
   */
  private static expandShortHexString(hexString: string): string {
    let fullHexString = '';

    for (let i = 1; i <= 3; i++) {
      fullHexString += `${hexString[i]}${hexString[i]}`;
    }

    return fullHexString;
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
   * @param changeDetectorRef the Angular ChangeDetectorRef
   */
  constructor(private renderer: Renderer2, private changeDetectorRef: ChangeDetectorRef) { }

  /**
   * Init component, check for color picker browser support
   */
  ngOnInit(): void {
    this.colorPickerSupported = this.isColorPickerSupported();
    this.render = true;
  }

  /**
   * Write value
   * @param value the value to write
   */
  writeValue(value: string): void {
    if (!this._disabled) {
      this.value = value;
    }

    this.changeDetectorRef.markForCheck();
  }

  /**
   * Register on change function
   * @param fn the function to register
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Register on touched function
   * @param fn the function to register
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Set whether or not the control should be disabled
   * @param isDisabled disabled or not
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Prevent illegal input
   * @param event the keydown KeyboardEvent
   */
  handleKeyDown(event: KeyboardEvent): void {
    const { key } = event;
    const { selectionStart, selectionEnd, value } = event.target as HTMLInputElement;

    if (!ColorPickerComponent.NAVIGATION_KEYS.includes(key) && !event.ctrlKey) {
      ColorPickerComponent.HEX_CHARACTER_REGEX.lastIndex = 0;

      const preventDefault = !ColorPickerComponent.HEX_CHARACTER_REGEX.test(key) ||
        (value.length >= 6 && (selectionStart === selectionEnd));

      if (preventDefault) {
        event.preventDefault();
      }
    }
  }

  /**
   * Update model
   * @param value the new value of the model
   * @private
   */
  updateModel(value: string): void {
    ColorPickerComponent.FULL_HEX_REGEX.lastIndex = 0;
    let updateValue = value;

    if (updateValue) {
      updateValue = updateValue.replace('#', '');
    }

    if (!this._disabled && ColorPickerComponent.FULL_HEX_REGEX.test(updateValue)) {
      const valueBeforeUpdate = this._value;
      this.value = updateValue;

      if (valueBeforeUpdate !== this._value) {
        this.onChange(`#${updateValue}`);
      }
    } else if (!value) {
      this.value = null;
      this.onChange(null);
    }
  }

  /**
   * Null out value on blur if not valid hex string, otherwise update model
   * @param value the value to check
   */
  handleBlur(value: string): void {
    if (!ColorPickerComponent.FULL_HEX_REGEX.test(value)) {
      this.value = null;
      this.onChange(null);
    } else {
      this.updateModel(value);
    }
  }

  /**
   * Prevent pasting a non-hex string
   * @param event the paste ClipboardEvent
   */
  handlePaste(event: ClipboardEvent): void {
    event.preventDefault();

    if (!this._disabled) {
      let clipboardData: DataTransfer;

      if (event.clipboardData) {
        clipboardData = event.clipboardData;
      } else if ('clipboardData' in window) {
        clipboardData = (window as any).clipboardData.getData('text');
      }

      if (clipboardData) {
        ColorPickerComponent.FULL_HEX_REGEX.lastIndex = 0;
        const pastedText = clipboardData.getData('text')
          .replace('#', '');

        if (ColorPickerComponent.FULL_HEX_REGEX.test(pastedText)) {
          this.updateModel(pastedText);
        }
      }
    }
  }

  /**
   * Determine if the browser supports the HTML5 color picker
   * @private
   */
  private isColorPickerSupported(): boolean {
    let colorPickerSupported = false;

    try {
      const inputElement: HTMLInputElement = this.renderer.createElement('input');
      inputElement.type = 'color';
      inputElement.value = '!';

      colorPickerSupported = inputElement.type === 'color' && inputElement.value !== '!';
      inputElement.remove();
    } catch (e) { }

    return colorPickerSupported;
  }
}
