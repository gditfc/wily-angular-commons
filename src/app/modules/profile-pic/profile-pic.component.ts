import {Component, Input} from '@angular/core';

@Component({
  selector: 'wily-profile-pic',
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

  @Input()
  size = '50px';

  @Input()
  margin = '0';

  @Input()
  imageUrl: string;

  @Input()
  toolTip: string;

  getUrl(): string {
    if (this.imageUrl) {
      return `url(${this.imageUrl})`;
    }

    return null;
  }

}
