import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

/**
 * Directive to create a tooltip around the host element
 */
@Directive({
  selector: '[wilyTooltip]'
})
export class TooltipDirective {

  /**
   * Tooltip text input
   * @param text the text to set for the tooltip
   */
  @Input('wilyTooltip')
  set text(text: string) {
    this._text = text

    if (!!text) {
      if (!!this.tooltip?.parentElement) {
        this.setTooltipText();
        this.alignTooltip();
      }
    } else {
      this.deleteTooltip();
    }
  }
  get text() { return this._text }

  /**
   * The direction of the tooltip around the host element
   */
  @Input()
  tooltipPosition: 'left' | 'right' | 'top' | 'bottom' = 'bottom';

  /**
   * The DIV element housing the tooltip
   * @private
   */
  private tooltip: HTMLDivElement;

  /**
   * The tooltip text
   * @private
   */
  private _text: string;

  /**
   * Dependency injection site
   * @param element the host element
   * @param renderer the Angular renderer
   */
  constructor(private element: ElementRef<HTMLElement>, private renderer: Renderer2) { }

  /**
   * Handle host mouse enter event
   */
  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.showTooltip();
  }

  /**
   * Handle host mouse leave event
   */
  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.deleteTooltip();
  }

  /**
   * Create tooltip, set the text and align it
   * @private
   */
  private showTooltip(): void {
    this.createTooltip();
    this.setTooltipText();
    this.alignTooltip();
  }

  /**
   * Add the tooltip to the DOM
   * @private
   */
  private createTooltip(): void {
    this.deleteTooltip();

    this.tooltip = this.renderer.createElement('div');
    this.renderer.appendChild(this.element.nativeElement, this.tooltip);
    this.renderer.addClass(this.tooltip, 'wily_tooltip');
  }

  /**
   * Set tooltip text
   * @private
   */
  private setTooltipText(): void {
    this.renderer.setProperty(this.tooltip, 'innerHTML', this.text);
  }

  /**
   * Align the tooltip to the input position or the next best fit
   * @private
   */
  private alignTooltip(): void {
    switch (this.tooltipPosition) {
      case 'left':
        this.renderer.addClass(this.tooltip, 'left');

        if (!this.tooltipFitsInWindow()) {
          this.renderer.removeClass(this.tooltip, 'left');
          this.renderer.addClass(this.tooltip, 'top');

          if (!this.tooltipFitsInWindow()) {
            this.renderer.removeClass(this.tooltip, 'top');
            this.renderer.addClass(this.tooltip, 'right');

            if (!this.tooltipFitsInWindow()) {
              this.renderer.removeClass(this.tooltip, 'right');
              this.renderer.addClass(this.tooltip, 'bottom');
            }
          }
        }
        break;
      case 'top':
        this.renderer.addClass(this.tooltip, 'top');

        if (!this.tooltipFitsInWindow()) {
          this.renderer.removeClass(this.tooltip, 'top');
          this.renderer.addClass(this.tooltip, 'right');

          if (!this.tooltipFitsInWindow()) {
            this.renderer.removeClass(this.tooltip, 'right');
            this.renderer.addClass(this.tooltip, 'bottom');

            if (!this.tooltipFitsInWindow()) {
              this.renderer.removeClass(this.tooltip, 'bottom');
              this.renderer.addClass(this.tooltip, 'left');
            }
          }
        }
        break;
      case 'right':
        this.renderer.addClass(this.tooltip, 'right');

        if (!this.tooltipFitsInWindow()) {
          this.renderer.removeClass(this.tooltip, 'right');
          this.renderer.addClass(this.tooltip, 'bottom');

          if (!this.tooltipFitsInWindow()) {
            this.renderer.removeClass(this.tooltip, 'bottom');
            this.renderer.addClass(this.tooltip, 'left');

            if (!this.tooltipFitsInWindow()) {
              this.renderer.removeClass(this.tooltip, 'left');
              this.renderer.addClass(this.tooltip, 'top');
            }
          }
        }
        break;
      case 'bottom':
        this.renderer.addClass(this.tooltip, 'bottom');

        if (!this.tooltipFitsInWindow()) {
          this.renderer.removeClass(this.tooltip, 'bottom');
          this.renderer.addClass(this.tooltip, 'left');

          if (!this.tooltipFitsInWindow()) {
            this.renderer.removeClass(this.tooltip, 'left');
            this.renderer.addClass(this.tooltip, 'top');

            if (!this.tooltipFitsInWindow()) {
              this.renderer.removeClass(this.tooltip, 'top');
              this.renderer.addClass(this.tooltip, 'right');
            }
          }
        }
    }
  }

  /**
   * Checks if the tooltip fits in the window
   * @private
   */
  private tooltipFitsInWindow(): boolean {
    const { top, left } = this.tooltip.getBoundingClientRect();
    const { offsetWidth, offsetHeight } = this.tooltip;
    const { innerWidth, innerHeight } = window;

    return (left + offsetWidth > innerWidth) || (left < 0) || (top < 0) || (top + offsetHeight > innerHeight);
  }

  /**
   * Remove the tooltip from the DOM
   * @private
   */
  private deleteTooltip(): void {
    if (!!this.tooltip?.parentElement) {
      this.renderer.removeChild(document.body, this.tooltip);
      this.tooltip = null;
    }
  }
}
