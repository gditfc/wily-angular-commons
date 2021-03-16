import { Directive, ElementRef, HostListener, Input } from '@angular/core';

/**
 * Directive to apply key filtering to an HTML input element
 */
@Directive({
  selector: '[wilyKeyfilter]'
})
export class KeyfilterDirective {

  /**
   * Keyboard arrow key names
   * @private
   */
  private static readonly ARROW_KEYS = [
    'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'
  ];

  /**
   * Keyboard alpha key names
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
  filterType: 'numeric' | 'alphanumeric';

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
    return new RegExp('^\d&', 'g').test(key);
  }

  /**
   * Determine if the input key is an alpha key (a letter of
   * the English alphabet)
   * @param key the key to test
   * @private
   */
  private static keyIsAlpha(key: string): boolean {
    return this.ALPHA_KEYS.includes(key);
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

      if (this.allowSpaces && key === '\s') {
        preventDefault = false;
      } else if (KeyfilterDirective.ARROW_KEYS.includes(key)) {
        preventDefault = false;
      } else if (this.filterType === 'numeric') {
        preventDefault = !KeyfilterDirective.keyIsNumeric(key);
      } else if (this.filterType === 'alphanumeric') {
        const isNumeric = KeyfilterDirective.keyIsNumeric(key);
        const isAlpha = KeyfilterDirective.keyIsAlpha(key);

        preventDefault = isNumeric && isAlpha;
      }

      if (preventDefault) {
        event.preventDefault();
      }
    }
  }
}
