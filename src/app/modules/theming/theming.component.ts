import {Component, OnDestroy, OnInit, Input} from '@angular/core';
import {ThemingService} from './services/theming.service';
import {Theme} from './models/theme.model';
import {Message} from 'primeng/api';

@Component({
  selector: 'wily-theming',
  templateUrl: './theming.component.html'
})
export class ThemingComponent implements OnInit, OnDestroy {

  @Input()
  experimental: boolean;

  theme: Theme;
  themes: Theme[] = [];
  selectedTheme = 0;
  customTheme: any;
  messages: Message[] = [];

  constructor(private themingService: ThemingService) {
  }

  ngOnInit() {
    this.theme = this.themingService.getTheme();

    this.selectedTheme = this.theme.themeId;

    if (this.selectedTheme === -1) {
      this.customTheme = new Theme(this.theme);
    }

    this.getThemes();
  }

  ngOnDestroy() {
    this.themingService.changeColors(this.themingService.getTheme());
  }

  private getThemes(): void {
    this.themingService.getThemes().subscribe(
      results => {
        this.themes = results;
      }
    );
  }

  saveColors() {
    this.themingService.saveTheme(this.theme);
    this.messages = [];
    this.messages.push({severity: 'success', summary: 'Theme Saved'});
  }

  changeColors() {
    this.selectedTheme = -1;
    this.customTheme = new Theme(this.theme);
    this.themingService.changeColors(this.theme);
  }

  changeTheme() {
    for (const theme of this.themes) {
      if (theme.themeId === parseInt(this.selectedTheme + '', 10)) {
        this.updateColorsFromTheme(theme);
        break;
      }
    }

    if (parseInt(this.selectedTheme + '', 10) === -1) {
      this.updateColorsFromTheme(this.customTheme);
    }
  }

  updateColorsFromTheme(theme: any) {
    if (!theme) {
      return;
    }

    this.theme = new Theme(theme);
    this.themingService.changeColors(this.theme);
  }

  randomizeColors(): void {
    this.theme = this.themingService.randomizeColors();
    this.selectedTheme = this.theme.themeId;
  }

  discoMode(): void {
    this.themingService.doDiscoMode();
  }

  reset(): void {
    this.themingService.getDefaultTheme().subscribe(
      result => {
        this.selectedTheme = result.themeId;
        this.changeTheme();
      }
    );
  }

}
