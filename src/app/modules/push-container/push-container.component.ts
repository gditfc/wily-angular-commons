import {AfterViewInit, Component, HostListener, Input} from '@angular/core';

@Component({
  selector: 'wily-push-container',
  templateUrl: './push-container.component.html',
  styleUrls: ['./push-container.component.css']
})
export class PushContainerComponent implements AfterViewInit {

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

  constructor() {
  }

  ngAfterViewInit(): void {
    document.getElementById(this.mainContentId).style.transition = 'all 0.2s ease-in-out';

    if (window.innerWidth > 768 && this.showSidePanel) {
      this.setMargin('230px');
    } else {
      setTimeout(() => {
        this.close();
      }, 100);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (event.target.innerWidth <= 768 && this.showSidePanel) {
      if (this.closeOnResize) {
        this.showSidePanel = false;
      }

      this.setMargin('0px');
    } else if (event.target.innerWidth > 768 && this.showSidePanel) {
      this.setMargin('230px');
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
      this.setMargin('230px');
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

  getSidePanelClass(): string {
    if (this.showSidePanel) {
      return 'layout_sidebar_active_' + this.side.toLowerCase();
    } else {
      return 'layout_sidebar_inactive_' + this.side.toLowerCase();
    }
  }

}
