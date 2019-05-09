import {Component, ViewChild} from '@angular/core';
import {DialogComponent} from './modules/dialog/dialog.component';
import {PushContainerComponent} from './modules/push-container/push-container.component';

@Component({
  selector: 'wily-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  obj: any;

  @ViewChild('dialog')
  dialog: DialogComponent;

  @ViewChild('pushContainerLeft')
  pushContainerLeft: PushContainerComponent;

  constructor() {
  }

  showDialog(): void {
    this.obj = {};
    this.dialog.open();
  }


  iconSelected(event: any) {
    console.log(event.value);
  }
}
