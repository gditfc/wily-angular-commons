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

  private static getRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  public static lightenDarkenColor(color: string, percent: number): string {
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

    return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
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
    style.type = 'text/css';

    this.applyHash(theme);

    if (theme.menuColor) {
      style.appendChild(document.createTextNode(`.menu_color{background-color: ${theme.menuColor};}`));
    }

    if (theme.navColor) {
      style.appendChild(document.createTextNode(`.nav_color{background-color: ${theme.navColor};}`));
    }

    if (theme.footerColor) {
      style.appendChild(document.createTextNode(`.footer_color{background-color: ${theme.footerColor};}`));
    }

    if (theme.mainBgColor) {
      style.appendChild(document.createTextNode(`.main_bg_color{background-color: ${theme.mainBgColor};}`));
    }

    if (theme.containerColor) {
      style.appendChild(document.createTextNode(`.container_color{background-color: ${theme.containerColor};}`));
    }

    if (theme.headerColor) {
      style.appendChild(document.createTextNode(`.header_color{background-color: ${theme.headerColor};}`));
    }

    if (theme.bgColor1) {
      style.appendChild(document.createTextNode(`.bg_color_1{background-color: ${theme.bgColor1};}`));
    }

    if (theme.bgColor2) {
      style.appendChild(document.createTextNode(`.bg_color_2{background-color: ${theme.bgColor2};}`));
    }

    if (theme.bgColor3) {
      style.appendChild(document.createTextNode(`.bg_color_3{background-color: ${theme.bgColor3};}`));
    }

    if (theme.bgColor4) {
      style.appendChild(document.createTextNode(`.bg_color_4{background-color: ${theme.bgColor4};}`));
    }

    if (theme.bgColor5) {
      style.appendChild(document.createTextNode(`.bg_color_5{background-color: ${theme.bgColor5};}`));
    }

    if (theme.borderColor) {
      style.appendChild(document.createTextNode(`.border_color{border: 1px solid ${theme.borderColor};}`));
    }

    if (theme.fontColor1) {
      style.appendChild(document.createTextNode(`.font_color_1{color: ${theme.fontColor1};}`));
    }

    if (theme.fontColor2) {
      style.appendChild(document.createTextNode(`.font_color_2{color: ${theme.fontColor2};}`));
    }

    if (theme.ok) {
      style.appendChild(document.createTextNode(`.t_ok{background-color: ${theme.ok};}`));
    }

    if (theme.go) {
      style.appendChild(document.createTextNode(`.t_go{background-color: ${theme.go};}`));
    }

    if (theme.cancel) {
      style.appendChild(document.createTextNode(`.t_cancel{background-color: ${theme.cancel};}`));
    }

    if (theme.alert) {
      style.appendChild(document.createTextNode(`.t_alert{background-color: ${theme.alert};}`));
    }

    if (theme.progress) {
      style.appendChild(document.createTextNode(`.t_progress{background-color: ${theme.progress};}`));
    }

    if (theme.info) {
      style.appendChild(document.createTextNode(`.t_info{background-color: ${theme.info};}`));
    }

    if (theme.warning) {
      style.appendChild(document.createTextNode(`.t_warning{background-color: ${theme.warning};}`));
    }

    const head = document.head || document.getElementsByTagName('head')[0];

    for (const child of <any> head.childNodes) {
      if ((<Element> child).innerHTML && (<Element> child).innerHTML.startsWith('.menu_color')) {
        head.removeChild(child);
        break;
      }
    }

    head.appendChild(style);
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
      settings[property] = ThemingService.getRandomColor();
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
