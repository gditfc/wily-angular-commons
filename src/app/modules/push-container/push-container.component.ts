import {AfterViewInit, Component, EventEmitter, HostListener, Input, OnDestroy, Output} from '@angular/core';

/**
 * Push Container that'll either push the content or overlay the content based on screen width.
 */
@Component({
  selector: 'wily-push-container',
  templateUrl: './push-container.component.html',
  styleUrls: ['./push-container.component.css']
})
export class PushContainerComponent implements AfterViewInit, OnDestroy {

  /**
   * Width of the container in pixels.
   */
  @Input()
  width = 230;

  /**
   * Show the side panel on load?
   */
  @Input()
  showSidePanel = false;

  /**
   * Main Content ID that will be pushed by this
   */
  @Input()
  mainContentId: string;

  /**
   * Side to push from (left/right)
   */
  @Input()
  side = 'left';

  /**
   * Top offset to account for a nav bar
   */
  @Input()
  topOffset = '0px';

  /**
   * If the screen resizes, it will either overlay or close depending on this variable
   */
  @Input()
  closeOnResize = false;

  /**
   * Background color for the container
   */
  @Input()
  backgroundColorClass = 'push_container_color';

  /**
   * Breakpoint that will make the container take over the screen when it's crossed.
   */
  @Input()
  breakpoint: number;

  /**
   * Event emitter for open
   */
  @Output()
  opened: EventEmitter<any> = new EventEmitter();

  /**
   * Event emitter for close
   */
  @Output()
  closed: EventEmitter<any> = new EventEmitter();

  /**
   * Private variable to detect if the breakpoint is exceeded
   */
  private breakpointExceeded = false;

  /**
   * Visibility variable for accessibility
   */
  private visibility: boolean;

  /**
   * Show or close the push container on load depending on the state passed in.
   */
  ngAfterViewInit(): void {
    this.visibility = this.showSidePanel;

    document.getElementById(this.mainContentId).style.transition = 'all 0.2s ease-in-out';

    if (window.innerWidth > 768 && this.showSidePanel) {
      this.setMargin(this.width + 'px');
    } else {
      setTimeout(() => {
        this.close();
      }, 100);
    }

    if (this.breakpoint && (window.innerWidth < this.breakpoint)) {
      this.breakpointExceeded = true;
    }
  }

  /**
   * Close the push container on destroy
   */
  ngOnDestroy(): void {
    this.close();
  }

  /**
   * Monitor the screen size and perform actions as specified by the input options
   *
   * @param event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (event.target.innerWidth <= 768 && this.showSidePanel) {
      if (this.closeOnResize) {
        this.showSidePanel = false;
      }

      this.setMargin('0px');
    } else if (event.target.innerWidth > 768 && this.showSidePanel) {
      this.setMargin(this.width + 'px');
    }

    if (this.breakpoint) {
      this.breakpointExceeded = event.target.innerWidth < this.breakpoint;
    }
  }

  /**
   * Open or close based on current state.
   */
  toggle(): void {
    if (this.showSidePanel) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open the push container
   *
   * @param init
   */
  open(init?: boolean): void {
    this.visibility = true;

    if (init && window.innerWidth <= 768) {
      return;
    }

    this.showSidePanel = true;
    this.opened.emit({});

    if (window.innerWidth > 768) {
      this.setMargin(this.width + 'px');
    }
  }

  /**
   * Close the push container
   */
  close(): void {
    this.showSidePanel = false;
    this.closed.emit({});
    this.setMargin('0px');

    setTimeout(() => this.visibility = false, 200);
  }

  /**
   * Set the margin
   *
   * @param size
   */
  private setMargin(size: string): void {
    if (this.side.toLowerCase() === 'left') {
      document.getElementById(this.mainContentId).style.marginLeft = size;

      if (size === '0px') {
        document.getElementById(this.mainContentId).style.removeProperty('margin-left');
      }
    } else if (this.side.toLowerCase() === 'right') {
      document.getElementById(this.mainContentId).style.marginRight = size;

      if (size === '0px') {
        document.getElementById(this.mainContentId).style.removeProperty('margin-right');
      }
    }
  }

  /**
   * Get the width of the container
   */
  getWidth(): string {
    if (this.breakpointExceeded && this.showSidePanel) {
      return '100%';
    } else {
      return this.width + 'px';
    }
  }

  /**
   * Get the side panel class based on the current state.
   */
  getSidePanelClass(): string {
    if (this.showSidePanel) {
      return this.backgroundColorClass + ' layout_sidebar_active_' + this.side.toLowerCase();
    } else {
      return this.backgroundColorClass + ' layout_sidebar_inactive_' + this.side.toLowerCase();
    }
  }

  /**
   * Get the left size based on the options
   */
  getLeftProperty(): string {
    if (this.side !== 'left') {
      return '';
    } else {
      if (this.showSidePanel) {
        return '0';
      } else {
        return '-' + this.width + 'px';
      }
    }
  }

  /**
   * Get the right size based on the options
   */
  getRightProperty(): string {
    if (this.side !== 'right') {
      return '';
    } else {
      if (this.showSidePanel) {
        return '0';
      } else {
        return '-' + (this.width + 20) + 'px';
      }
    }
  }

}
