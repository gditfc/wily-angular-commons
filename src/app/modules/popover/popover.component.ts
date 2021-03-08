import { animate, AnimationEvent, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';

/**
 * Component to display a popover with custom content
 */
@Component({
  selector: 'wily-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.css'],
  animations: [
    trigger('openClose', [
      transition('void => open', [
        animate('200ms ease', keyframes([
          style({ opacity: 0, transform: 'scaleY(0.5)', offset: 0 }),
          style({ opacity: 0, offset: .25 }),
          style({ opacity: 1, transform: 'scaleY(1)', offset: 1 })
        ]))
      ]),
      transition('open => close', [
        animate('200ms ease', keyframes([
          style({ opacity: 1, transform: 'scaleY(1)', offset: 0 }),
          style({ opacity: 0, offset: .25 }),
          style({ opacity: 0, transform: 'scaleY(0.5)', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class PopoverComponent implements OnInit {

  /**
   * The offset of the popover from its target (in pixels)
   * @private
   */
  private static POPOVER_OFFSET = 5;

  /**
   * The keyboard arrow keys
   * @private
   */
  private static ARROW_KEYS = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'];

  /**
   * Set the width of the popover in pixels (defaults to auto)
   */
  @Input('width')
  set setWidth(width: number) {
    this.width = !width ? 'auto' : `${width}px`;
  }

  /**
   * Set the height of the popover in pixels (defaults to auto)
   */
  @Input('height')
  set setHeight(height: number) {
    this.width = !height ? 'auto' : `${height}px`;
  }

  /**
   * A class-list to apply to the popover content
   */
  @Input()
  classList = 'page_container_color';

  /**
   * Event emitted on popover open
   */
  @Output()
  opened = new EventEmitter<void>();

  /**
   * Event emitted on popover close
   */
  @Output()
  closed = new EventEmitter<void>();

  /**
   * Whether or not the popover should render
   */
  render: boolean;

  /**
   * Whether or not the popover is visible
   */
  visible: boolean;

  /**
   * The width of the popover
   */
  width = 'auto';

  /**
   * The height of the popover
   */
  height = 'auto';

  /**
   * The element to target
   * @private
   */
  private target: EventTarget;

  /**
   * The popover content container
   * @private
   */
  private container: HTMLDivElement;

  /**
   * Dependency injection site
   * @param renderer the Angular renderer
   */
  constructor(private renderer: Renderer2) { }

  /**
   * Init component
   */
  ngOnInit(): void { }

  /**
   * Close popover on click
   * @param event the click MouseEvent
   */
  @HostListener('window:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.visible) {
      const {pageX, pageY} = event;

      if (pageX > 0 && pageY > 0) {
        const { left, right, top, bottom } = this.container.getBoundingClientRect();
        const xPositionValid = pageX >= left && pageX <= right;
        const yPositionValid = pageY >= top && pageY <= bottom;
        const shouldClose = !(xPositionValid && yPositionValid);

        if (shouldClose) {
          this.close();
        }
      }
    }
  }

  /**
   * Prevent arrow key scrolling while popover is open
   */
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const { key } = event;

    if (this.visible && PopoverComponent.ARROW_KEYS.includes(key)) {
      event.preventDefault();
    }
  }

  /**
   * Close popover on escape keyup
   * @param event the keyup KeyboardEvent
   */
  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    const { key } = event;

    if (this.visible && (key === 'Esc' || key === 'Escape')) {
      this.close();
    }
  }

  /**
   * Re-position popover on window resize
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.visible) {
      this.positionPopover();
    }
  }

  /**
   * Toggle the popover from open to closed or closed to open
   * @param event
   */
  toggle(event: Event): void {
    event.stopImmediatePropagation();

    this.target = event.currentTarget ?? event.target;

    if (!this.visible) {
      this.open();
    } else {
      this.close();
    }
  }

  /**
   * Handle animation start
   * @param event the AnimationEvent
   */
  onAnimationStart(event: AnimationEvent): void {
    if (event.toState === 'open') {
      this.container = event.element;
      this.positionPopover();
      this.opened.emit();
    }
  }

  /**
   * Handle animation end
   * @param event the AnimationEvent
   */
  onAnimationDone(event: AnimationEvent): void {
    if (event.toState === 'close') {
      this.render = false;
      this.closed.emit();
    }
  }

  /**
   * Open the popover
   * @private
   */
  private open(): void {
    this.render = true;
    this.visible = true;
  }

  /**
   * Close the popover
   * @private
   */
  private close(): void {
    this.visible = false;
  }

  /**
   * Position the popover
   * @private
   */
  private positionPopover(): void {
    const {left, top, bottom} = (this.target as HTMLElement).getBoundingClientRect();
    const {offsetHeight} = this.container;
    const popoverBottomLeftAnchor = bottom;
    const availableBottomSpace = window.innerHeight - popoverBottomLeftAnchor;
    const availableTopSpace = top;
    const offsetListHeight = offsetHeight + PopoverComponent.POPOVER_OFFSET;
    let transformOrigin: string, positionTop: string;

    if (availableBottomSpace > offsetListHeight) {
      transformOrigin = 'top left';
      positionTop = `${popoverBottomLeftAnchor + PopoverComponent.POPOVER_OFFSET}px`;
    } else if (availableTopSpace > offsetListHeight) {
      transformOrigin = 'bottom left';
      positionTop = `${top - offsetListHeight}px`;
    } else {
      if (offsetHeight > window.innerHeight) {
        positionTop = '0px';
      } else {
        const availableSpace = window.innerHeight - offsetHeight;
        positionTop = `${String(availableSpace / 2)}px`;
      }

      transformOrigin = 'top left';
    }

    this.renderer.setStyle(this.container, 'transform-origin', transformOrigin);
    this.renderer.setStyle(this.container, 'left', `${left}px`);
    this.renderer.setStyle(this.container, 'top', positionTop);
  }
}
