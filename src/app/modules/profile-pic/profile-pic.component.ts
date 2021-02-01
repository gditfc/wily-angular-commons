import {Component, Input} from '@angular/core';

/**
 * Profile Pic display shortcut
 */
@Component({
  selector: 'wily-profile-pic',
  styleUrls: ['./profile-pic.component.css'],
  template: `
    <div class="wac_photo_id_round"
         [style.height]="size"
         [style.width]="size"
         [style.margin]="margin"
         [style.backgroundImage]="getUrl() | safeStyle"
         [pTooltip]="toolTip"
         tooltipPosition="top"
         [escape]="false">
    </div>`
})
export class ProfilePicComponent {

  /**
   * Size of the profile pic circle (default to 50px)
   */
  @Input()
  size = '50px';

  /**
   * Configurable CSS Margin
   */
  @Input()
  margin = '0';

  /**
   * Image URL of the profile pic
   */
  @Input()
  imageUrl: string;

  /**
   * Tooltip to explain what the picture is
   */
  @Input()
  toolTip: string;

  /**
   * Returns a CSS URL of the Image URL.
   */
  getUrl(): string {
    if (this.imageUrl) {
      return `url(${this.imageUrl})`;
    }

    return null;
  }

}
