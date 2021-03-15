import { Injectable } from '@angular/core';
import { FontawesomeIconsBrands } from '../models/fontawesome-icons-brands.model';
import { FontawesomeIconsRegular } from '../models/fontawesome-icons-regular.model';
import { FontawesomeIconsSolid } from '../models/fontawesome-icons-solid.model';
import { WilyIconsLight } from '../models/wily-icons-light.model';
import { WilyIconsRegular } from '../models/wily-icons-regular.model';
import { WilyIconsSolid } from '../models/wily-icons-solid.model';

/**
 * Type representing the available Wily icon filter options
 */
declare type WilyIconFilterOption = 'all' | 'solid' | 'regular' | 'light';

/**
 * Type representing the available Fontawesome icon filter options
 */
declare type FontawesomeIconFilterOption = 'all' | 'solid' | 'regular' | 'brands';

/**
 * Service for filtering Wily/Fontawesome icons
 */
@Injectable()
export class IconsService {

  /**
   * Get Fontawesome icons filtered by icon type
   * @param filter the icon type to filter by
   * @private
   */
  private static getFontawesomeIcons(filter: FontawesomeIconFilterOption): Array<string> {
    const icons: Array<string> = [];

    if (filter === 'all' || filter === 'solid') {
      icons.push(...FontawesomeIconsSolid.ICONS.map(icon => FontawesomeIconsSolid.PREFIX + icon));
    }

    if (filter === 'all' || filter === 'regular') {
      icons.push(...FontawesomeIconsRegular.ICONS.map(icon => FontawesomeIconsRegular.PREFIX + icon));
    }

    if (filter === 'all' || filter === 'brands') {
      icons.push(...FontawesomeIconsBrands.ICONS.map(icon => FontawesomeIconsBrands.PREFIX + icon));
    }

    return icons;
  }

  /**
   * Get Wily icons filtered by icon type
   * @param filter the icon type to filter by
   * @private
   */
  private static getWilyIcons(filter: WilyIconFilterOption): Array<string> {
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

  /**
   * Constructor
   */
  constructor() { }

  /**
   * Get a list of icons (as strings) containing both Wily icons
   * and Fontawesome icons that match their respective filter criteria
   * @param wilyFilter the type of Wily icon to fetch
   * @param fontawesomeFilter the type of Fontawesome icon to fetch
   * @param searchText the search text to filter icons by
   */
  getIcons(
    wilyFilter: WilyIconFilterOption,
    fontawesomeFilter: FontawesomeIconFilterOption,
    searchText = ''
  ): Array<string> {
    let icons: Array<string> = [];
    const wilyIcons = IconsService.getWilyIcons(wilyFilter);
    const fontawesomeIcons = IconsService.getFontawesomeIcons(fontawesomeFilter);

    if (wilyIcons.length) {
      icons.push(...wilyIcons);
    }

    if (fontawesomeIcons.length) {
      icons.push(...fontawesomeIcons);
    }

    const trimmedSearchText = searchText.trim().toLowerCase();
    if (trimmedSearchText) {
      icons = icons.filter(icon => icon.includes(trimmedSearchText));
    }

    return icons;
  }
}
