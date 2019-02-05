import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ThemingService} from './modules/theming/services/theming.service';
import {HelpText} from './modules/help-widget/help-widget.component';
import {DialogComponent} from './modules/wily-dialog/dialog.component';
import {PushContainerComponent} from './modules/push-container/push-container.component';

@Component({
  selector: 'wily-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'app';

  obj: HelpText;

  @ViewChild('dialog')
  dialog: DialogComponent;

  @ViewChild('pushContainerLeft')
  pushContainerLeft: PushContainerComponent;

  constructor(
    private themingService: ThemingService
  ) {
    this.themingService.appInit('pm', 'https://services.transcend.csra.io/help');
  }

  showDialog(): void {
    this.obj = new HelpText();
    this.dialog.open();
  }

}
