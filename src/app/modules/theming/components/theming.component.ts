import {Component, OnInit, Input} from '@angular/core';
import {ThemingService} from '../services/theming.service';
import {Theme} from '../models/theme.model';

@Component({
  selector: 'wily-theming',
  templateUrl: './theming.component.html'
})
export class ThemingComponent implements OnInit {

  @Input()
  selectClass: string;

  theme: Theme;
  themes: Theme[] = [];

  constructor(
    private themingService: ThemingService
  ) {}

  ngOnInit() {
    this.theme = this.themingService.getTheme();
    this.themingService.getThemes().subscribe(
      results => {
        this.themes = results;
      }
    );
  }

  changeTheme(event: any): void {
    
  }

}
