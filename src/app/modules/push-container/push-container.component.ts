import {AfterViewInit, Component, HostListener, Input, OnDestroy} from '@angular/core';

@Component({
  selector: 'wily-push-container',
  templateUrl: './push-container.component.html',
  styleUrls: ['./push-container.component.css']
})
export class PushContainerComponent implements AfterViewInit, OnDestroy {

  @Input()
  width = 230;

  @Input()
  showSidePanel = false;

  @Input()
  mainContentId: string;

  @Input()
  side = 'left';

  @Input()
  topOffset = '0px';

  @Input()
  closeOnResize = false;

  @Input()
  backgroundColorClass = 'push_container_color';

  @Input()
  breakpoint: number;

  private breakpointExceeded = false;

  constructor() {
  }

  ngAfterViewInit(): void {
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

  ngOnDestroy(): void {
    this.close();
  }

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
      if (event.target.innerWidth < this.breakpoint) {
        this.breakpointExceeded = true;
      } else {
        this.breakpointExceeded = false;
      }
    }
  }

  toggle(): void {
    if (this.showSidePanel) {
      this.close();
    } else {
      this.open();
    }
  }

  open(init?: boolean): void {
    if (init && window.innerWidth <= 768) {
      return;
    }

    this.showSidePanel = true;

    if (window.innerWidth > 768) {
      this.setMargin(this.width + 'px');
    }
  }

  close(): void {
    this.showSidePanel = false;
    this.setMargin('0px');
  }

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

  getWidth(): string {
    if (this.breakpointExceeded && this.showSidePanel) {
      return '100%';
    } else {
      return this.width + 'px';
    }
  }

  getSidePanelClass(): string {
    if (this.showSidePanel) {
      return this.backgroundColorClass + ' layout_sidebar_active_' + this.side.toLowerCase();
    } else {
      return this.backgroundColorClass + ' layout_sidebar_inactive_' + this.side.toLowerCase();
    }
  }

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
