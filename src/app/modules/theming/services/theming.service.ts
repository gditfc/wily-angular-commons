import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs/index';
import {Theme} from '../models/theme.model';
import {BaseDataService} from '../../../shared/services/base-data.service';
import {LocalStorageService} from '../../../shared/services/local-storage.service';

@Injectable()
export class ThemingService extends BaseDataService {

  private static readonly THEME_KEY = 'theme';

  private themes = new BehaviorSubject<Theme[]>([]);

  protected overrideUrl: string;
  protected productKey: string;

  private static toSnakeCase(prop: string): string {
    return prop.split(/(?=[A-Z])/).join('_').toLowerCase();
  }

  private static lightenDarkenColor(color: string, percent: number): string {
    let usePound = false;
    if (color[0] === '#') {
      color = color.slice(1);
      usePound = true;
    }

    const num = parseInt(color, 16);

    let r = (num >> 16) + percent;
    if (r > 255) {
      r = 255;
    } else if (r < 0) {
      r = 0;
    }

    let b = ((num >> 8) & 0x00FF) + percent;
    if (b > 255) {
      b = 255;
    } else if (b < 0) {
      b = 0;
    }

    let g = (num & 0x0000FF) + percent;
    if (g > 255) {
      g = 255;
    } else if (g < 0) {
      g = 0;
    }

    let newColor = (g | (b << 8) | (r << 16)).toString(16);

    while (newColor.length < 6) {
      newColor = '0' + newColor;
    }

    return (usePound ? '#' : '') + newColor;
  }

  private static hexToRgb(hex): any {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  static getRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  constructor(
    private localStorageService: LocalStorageService,
    protected http: HttpClient
  ) {
    super(http);
  }

  getBaseUrl(): string {
    return this.overrideUrl ? this.overrideUrl : '';
  }

  appInit(productKey: string, baseUrl: string): void {
    if (!this.overrideUrl) {
      if (!baseUrl || !productKey) {
        throw new Error('Base URL and Product Key were not supplied.');
      }

      this.overrideUrl = baseUrl;
      this.productKey = productKey;
      this.themes = new BehaviorSubject<Theme[]>([this.getTheme()]);
      this.loadThemes(productKey);
      this.applySettings();
    }
  }

  getThemes(): Observable<Theme[]> {
    return this.themes;
  }

  applySettings(): void {
    const settings = this.getTheme();
    this.changeColors(settings);
  }

  getTheme(): Theme {
    return new Theme(this.localStorageService.getObject(this.productKey + ThemingService.THEME_KEY));
  }

  saveTheme(settings: Theme): void {
    this.localStorageService.putObject(this.productKey + ThemingService.THEME_KEY, settings);
  }

  changeColors(theme: Theme): void {
    const style = document.createElement('style');

    for (const prop of Object.keys(theme)) {
      if (prop.toLowerCase().includes('bg') || prop.toLowerCase().includes('color')) {
        const color = (<string>theme[prop]).startsWith('#') ? theme[prop] : '#' + theme[prop];
        this.generateColors(style, color, ThemingService.toSnakeCase(prop));
      }
    }

    if (theme.overlayStyle) {
      style.appendChild(document.createTextNode(`.overlay{${theme.overlayStyle}}`));
    }

    if (theme.overlayStyleAlt1) {
      style.appendChild(document.createTextNode(`.overlay_alt1{${theme.overlayStyleAlt1}}`));
    }

    if (theme.overlayStyleAlt2) {
      style.appendChild(document.createTextNode(`.overlay_alt2{${theme.overlayStyleAlt2}}`));
    }

    // TOAST MESSAGES FOR PRIMENG
    style.appendChild(
      document.createTextNode(
    `.ui-toast-message-success{background-color: #${theme.bgGreenAlt};color: ${this.getTextColor(theme.bgGreenAlt)};fill: currentColor;}`
      )
    );

    style.appendChild(
      document.createTextNode(
        `.ui-toast-message-info{background-color: #${theme.bgBlueAlt};color: ${this.getTextColor(theme.bgBlueAlt)};fill: currentColor;}`
      )
    );

    style.appendChild(
      document.createTextNode(
        `.ui-toast-message-warn{background-color: #${theme.bgYellowAlt};color: ${this.getTextColor(theme.bgYellowAlt)};fill: currentColor;}`
      )
    );

    style.appendChild(
      document.createTextNode(
        `.ui-toast-message-error{background-color: #${theme.bgRedAlt};color: ${this.getTextColor(theme.bgRedAlt)};fill: currentColor;}`
      )
    );

    const head = document.head || document.getElementsByTagName('head')[0];

    for (const child of <any>head.childNodes) {
      if ((<Element>child).innerHTML && (<Element>child).innerHTML.startsWith('.menu_color')) {
        head.removeChild(child);
        break;
      }
    }

    head.appendChild(style);
  }

  private luminance(r, g, b) {
    const a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928
        ? v / 12.92
        : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  private contrast(rgb1, rgb2) {
    return (this.luminance(rgb1[0], rgb1[1], rgb1[2]) + 0.05)
      / (this.luminance(rgb2[0], rgb2[1], rgb2[2]) + 0.05);
  }

  private loadThemes(productKey: string): void {
    this.handleGetList(`/api/public/products/${productKey}/themes`).subscribe(
      results => {
        this.themes.next(results);

        const currentTheme = this.getTheme();
        for (const theme of results) {
          if ((currentTheme.themeId === 0 && theme.isDefault === 'Y')
            || (currentTheme.themeId === theme.themeId && currentTheme.version !== theme.version)) {
            this.saveTheme(theme);
            this.applySettings();
            break;
          }
        }
      }
    );
  }

  private getTextColor(color: string): string {
    const rgb = ThemingService.hexToRgb(color);
    let textRgb = ThemingService.hexToRgb('#FFFFFF');
    let contrast = this.contrast([textRgb.r, textRgb.g, textRgb.b], [rgb.r, rgb.g, rgb.b]);
    const whiteContrast = contrast < 1 ? this.contrast([rgb.r, rgb.g, rgb.b], [textRgb.r, textRgb.g, textRgb.b]) : contrast;

    textRgb = ThemingService.hexToRgb('#222222');
    contrast = this.contrast([textRgb.r, textRgb.g, textRgb.b], [rgb.r, rgb.g, rgb.b]);
    const blackContrast = contrast < 1 ? this.contrast([rgb.r, rgb.g, rgb.b], [textRgb.r, textRgb.g, textRgb.b]) : contrast;

    // 7 is the contrast ratio for WCAG AAA, if we're less than that, go full black for max contrast
    if (blackContrast > whiteContrast && blackContrast < 7) {
      return '#000000';
    }

    return whiteContrast > blackContrast ? '#FFFFFF' : '#222222';
  }

  private generateColors(style: HTMLStyleElement, color: string, className: string): void {
    if (!color) {
      return;
    }

    let textColor = this.getTextColor(color);
    style.appendChild(document.createTextNode(`.${className}{background-color: ${color};color: ${textColor};fill: currentColor;}`));
    for (let i = 1; i < 10; i++) {
      const newColor = ThemingService.lightenDarkenColor(color, i * 10);
      textColor = this.getTextColor(newColor);

      style.appendChild(
        document.createTextNode(`.${className}_light_${i}{background-color: ${newColor};color: ${textColor};fill: currentColor;}`));
    }

    for (let i = 1; i < 10; i++) {
      const newColor = ThemingService.lightenDarkenColor(color, 0 - (i * 10));
      textColor = this.getTextColor(newColor);

      style.appendChild(
        document.createTextNode(`.${className}_dark_${i}{background-color: ${newColor};color: ${textColor};fill: currentColor;}`));
    }
  }

}
