import {Injectable} from '@angular/core';
import {Theme} from '../models/theme.model';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs/index';
import {BaseDataService} from '../../../shared/services/base.data.service';
import {LocalStorageService} from '../../../shared/services/localStorage.service';

@Injectable()
export class ThemingService extends BaseDataService {

  private static readonly THEME_KEY = 'theme';

  private discoModeInterval: any;
  private defaultTheme = new BehaviorSubject<Theme>(new Theme());
  private themes = new BehaviorSubject<Theme[]>([]);

  protected overrideUrl: string;
  protected productKey: string;

  constructor(
    private localStorageService: LocalStorageService,
    protected http: HttpClient
  ) {
    super(http);
  }

  lightenDarkenColor(color: string, percent: number): string {
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

  private getRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
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

  private hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }


  appInit(productKey: string, baseUrl: string): void {
    if (!this.overrideUrl) {
      if (!baseUrl || !productKey) {
        throw new Error('Base URL and Product Key were not supplied.');
      }

      this.overrideUrl = baseUrl;
      this.productKey = productKey;
      this.themes = new BehaviorSubject<Theme[]>([this.getTheme()]);
      this.loadThemes();
      this.loadDefaultTheme(productKey);

      const theme = this.getTheme();

      if (theme.themeId === 0) {
        this.getDefaultTheme().subscribe(
          result => {
            this.saveTheme(result);
            this.applySettings();
          }
        );
      }

      this.applySettings();
    }
  }

  private loadDefaultTheme(productKey: string): void {
    this.handleGet(`/api/public/products/${productKey}/theme`).subscribe(
      result => {
        this.defaultTheme.next(result);
      }
    );
  }

  private loadThemes(): void {
    this.handleGetList('/api/public/themes').subscribe(
      results => {
        this.themes.next(results);
      }
    );
  }

  getThemes(): Observable<Theme[]> {
    return this.themes;
  }

  getDefaultTheme(): Observable<Theme> {
    return this.defaultTheme;
  }

  private applyHash(theme: Theme): void {
    for (const property of Object.keys(theme)) {
      if (property !== 'themeId' && property !== 'name') {
        if (!(<string>theme[property]).startsWith('#')) {
          theme[property] = '#' + theme[property];
        }
      }
    }
  }

  changeColors(theme: Theme): void {
    const style = document.createElement('style');
    // style.type = 'text/css';

    this.applyHash(theme);

    this.generateColors(style, theme.menuColor, 'menu_color');
    this.generateColors(style, theme.navColor, 'nav_color');
    this.generateColors(style, theme.footerColor, 'footer_color');
    this.generateColors(style, theme.mainBgColor, 'main_bg_color');
    this.generateColors(style, theme.containerColor, 'container_color');
    this.generateColors(style, theme.headerColor, 'header_color');
    this.generateColors(style, theme.bgColor1, 'bg_color_1');
    this.generateColors(style, theme.bgColor2, 'bg_color_2');
    this.generateColors(style, theme.bgColor3, 'bg_color_3');
    this.generateColors(style, theme.bgColor4, 'bg_color_4');
    this.generateColors(style, theme.bgColor5, 'bg_color_5');
    this.generateColors(style, theme.ok, 't_ok');
    this.generateColors(style, theme.go, 't_go');
    this.generateColors(style, theme.cancel, 't_cancel');
    this.generateColors(style, theme.alert, 't_alert');
    this.generateColors(style, theme.progress, 't_progress');
    this.generateColors(style, theme.info, 't_info');
    this.generateColors(style, theme.warning, 't_warning');

    if (theme.borderColor) {
      style.appendChild(document.createTextNode(`.border_color{border: 1px solid ${theme.borderColor};}`));
    }

    if (theme.fontColor1) {
      style.appendChild(document.createTextNode(`.font_color_1{color: ${theme.fontColor1};}`));
    }

    if (theme.fontColor2) {
      style.appendChild(document.createTextNode(`.font_color_2{color: ${theme.fontColor2};}`));
    }

    const head = document.head || document.getElementsByTagName('head')[0];

    for (const child of <any>head.childNodes) {
      if ((<Element>child).innerHTML && (<Element>child).innerHTML.startsWith('.menu_color')) {
        head.removeChild(child);
        break;
      }
    }

    head.appendChild(style);
  }

  private getTextColor(color: string): string {
    const rgb = this.hexToRgb(color);
    let textRgb = this.hexToRgb('#FFFFFF');
    let contrast = this.contrast([textRgb.r, textRgb.g, textRgb.b], [rgb.r, rgb.g, rgb.b]);
    const whiteContrast = contrast < 1 ? this.contrast([rgb.r, rgb.g, rgb.b], [textRgb.r, textRgb.g, textRgb.b]) : contrast;

    textRgb = this.hexToRgb('#222222');
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
    style.appendChild(document.createTextNode(`.${className}{background-color: ${color};color: ${textColor};}`));
    for (let i = 1; i < 10; i++) {
      const newColor = this.lightenDarkenColor(color, i * 10);
      textColor = this.getTextColor(newColor);

      style.appendChild(document.createTextNode(`.${className}_light_${i}{background-color: ${newColor};color: ${textColor};}`));
    }

    for (let i = 1; i < 10; i++) {
      const newColor = this.lightenDarkenColor(color, 0 - (i * 10));
      textColor = this.getTextColor(newColor);

      style.appendChild(document.createTextNode(`.${className}_dark_${i}{background-color: ${newColor};color: ${textColor};}`));
    }
  }

  applySettings(): void {
    const settings = this.getTheme();
    this.changeColors(settings);
  }

  getTheme(): Theme {
    return new Theme(this.localStorageService.getObject(this.productKey + ThemingService.THEME_KEY));
  }

  saveTheme(settings: Theme): void {
    this.applyHash(settings);
    this.localStorageService.putObject(this.productKey + ThemingService.THEME_KEY, settings);
  }

  randomizeColors(): Theme {
    const settings = new Theme();
    for (const property of Object.keys(settings)) {
      settings[property] = this.getRandomColor();
    }

    settings.name = 'Custom';
    settings.themeId = -1;

    this.changeColors(settings);

    return settings;
  }

  doDiscoMode(): void {
    if (this.discoModeInterval) {
      clearInterval(this.discoModeInterval);
      this.discoModeInterval = null;
      this.changeColors(this.getTheme());
    } else {
      this.discoModeInterval = setInterval(
        () => {
          this.randomizeColors();
        }, 33
      );
    }
  }

  getBaseUrl(): string {
    return this.overrideUrl ? this.overrideUrl : '';
  }

}
