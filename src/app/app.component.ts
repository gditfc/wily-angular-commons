import {Component, ViewChild} from '@angular/core';
import {ThemingService} from './modules/theming/services/theming.service';
import {Help} from './modules/help-widget/help-widget.component';
import {DialogComponent} from './modules/wily-dialog/dialog.component';
import {PushContainerComponent} from './modules/push-container/push-container.component';
import {Theme} from './modules/theming/models/theme.model';

@Component({
  selector: 'wily-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  obj: Help;

  @ViewChild('dialog')
  dialog: DialogComponent;

  @ViewChild('pushContainerLeft')
  pushContainerLeft: PushContainerComponent;

  theme: Theme;

  constructor(
    private themingService: ThemingService
  ) {
    this.themingService.appInit('app_management', 'http://localhost:8080/appmgmt');
    this.theme = this.themingService.getTheme();
  }

  showDialog(): void {
    this.obj = new Help();
    this.dialog.open();
  }

}
