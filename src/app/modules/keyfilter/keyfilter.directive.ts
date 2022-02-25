import { Directive, ElementRef, HostListener, Input } from '@angular/core';

/**
 * Directive to apply key filtering to an HTML input element
 */
@Directive({
  selector: '[wilyKeyfilter]'
})
export class KeyfilterDirective {

  /**
   * Array of keyboard key names that are always allowed
   * (arrow keys, backspace, delete, tab, escape)
   * @private
   */
  private static readonly ALLOWED_KEYS = [
    'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown',
    'Backspace', 'Delete', 'Tab', 'Esc', 'Escape'
  ];

  /**
   * Array of keyboard alpha key names
   * @private
   */
  private static readonly ALPHA_KEYS = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z'
  ];

  /**
   * The type of filtering to apply
   */
  @Input('wilyKeyfilter')
  filterType: 'alpha' | 'numeric' | 'alphanumeric' = null as any;

  /**
   * Whether or not to allow spaces (default false)
   */
  @Input()
  allowSpaces = false;

  /**
   * Determine if the input key is numeric (a digit)
   * @param key the key to test
   * @private
   */
  private static keyIsNumeric(key: string): boolean {
    return new RegExp('^\\d$', 'g').test(key);
  }

  /**
   * Determine if the input key is an alpha key (a letter of
   * the English alphabet)
   * @param key the key to test
   * @private
   */
  private static keyIsAlpha(key: string): boolean {
    return KeyfilterDirective.ALPHA_KEYS.includes(key.toLowerCase());
  }

  /**
   * Dependency injection site
   * @param hostElement
   */
  constructor(private hostElement: ElementRef<HTMLInputElement>) { }

  /**
   * Filter out keys based on the specified filter type
   * @param event the keydown KeyboardEvent
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.filterType) {
      let preventDefault = true;
      const { key } = event;

      if (KeyfilterDirective.ALLOWED_KEYS.includes(key)) {
        preventDefault = false;
      } else if (this.allowSpaces && key === ' ') {
        preventDefault = false;
      } else if (this.filterType === 'alpha') {
        preventDefault = !KeyfilterDirective.keyIsAlpha(key);
      } else if (this.filterType === 'numeric') {
        preventDefault = !event.ctrlKey && !KeyfilterDirective.keyIsNumeric(key);
      } else if (this.filterType === 'alphanumeric') {
        const isNumeric = KeyfilterDirective.keyIsNumeric(key);
        const isAlpha = KeyfilterDirective.keyIsAlpha(key);

        preventDefault = !(isNumeric || isAlpha);
      }

      if (preventDefault) {
        event.preventDefault();
      }
    }
  }

  /**
   * Prevent paste if input contains forbidden characters
   * @param event the paste ClipboardEvent
   */
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    if (this.filterType) {
      let clipboardData: DataTransfer = null as any;

      if (event.clipboardData) {
        clipboardData = event.clipboardData;
      } else if ('clipboardData' in window) {
        clipboardData = (window as any).clipboardData.getData('text');
      }

      if (clipboardData) {
        const pastedText = clipboardData.getData('text');

        for (const char of pastedText.toString()) {
          const isSpace = char === ' ';
          const isAlpha = KeyfilterDirective.keyIsAlpha(char);
          const isNumeric = KeyfilterDirective.keyIsNumeric(char);
          const isAlphaNumeric = isAlpha || isNumeric;

          const charIsValid = (isSpace && this.allowSpaces) ||
            (this.filterType === 'alpha' && isAlpha) ||
            (this.filterType === 'numeric' && isNumeric) ||
            (this.filterType === 'alphanumeric' && isAlphaNumeric);

          if (!charIsValid) {
            event.preventDefault();
          }
        }
      }
    }
  }
}
