import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PushContainerComponent} from './push-container.component';

@NgModule({
  declarations: [PushContainerComponent],
  imports: [
    CommonModule
  ],
  exports: [
    PushContainerComponent
  ]
})
export class WilyPushContainerModule {
}
