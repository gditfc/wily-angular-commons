import { Injectable } from '@angular/core';
import { WilyIconsLight } from '../models/wily-icons-light.model';
import { WilyIconsRegular } from '../models/wily-icons-regular.model';
import { WilyIconsSolid } from '../models/wily-icons-solid.model';

@Injectable()
export class IconsService {
  constructor() { }

  /**
   * Get all Wily icons filtered by icon type
   * @param filter the icon type to filter by
   * @private
   */
  private getWilyIcons(filter: 'all' | 'solid' | 'regular' | 'light'): Array<string> {
    const icons: Array<string> = [];

    if (filter === 'all' || filter === 'solid') {
      icons.push(...WilyIconsSolid.icons.map(icon => `${icon.prefix}-${icon.iconName}`));
    }

    if (filter === 'all' || filter === 'regular') {
      icons.push(...WilyIconsRegular.icons.map(icon => `${icon.prefix}-${icon.iconName}`));
    }

    if (filter === 'all' || filter === 'light') {
      icons.push(...WilyIconsLight.icons.map(icon => `${icon.prefix}-${icon.iconName}`));
    }

    return icons;
  }
}
