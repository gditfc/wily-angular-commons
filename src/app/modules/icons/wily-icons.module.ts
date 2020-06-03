import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WilyIconsRegular} from './models/wily-icons-regular.model';
import {WilyIconsLight} from './models/wily-icons-light.model';
import {WilyIconsSolid} from './models/wily-icons-solid.model';
import {IconSelectComponent} from './components/icon-select.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TooltipModule} from 'primeng/tooltip';
import {DialogLegacyModule} from '../dialog-legacy/dialog-legacy.module';
import {DialogModule} from '../dialog/dialog.module';

/**
 * Reference to the Font Awesome variable to add icons
 */
const FontAwesome = window['FontAwesome'];

@NgModule({
  declarations: [
    IconSelectComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TooltipModule,
        DialogLegacyModule,
        DialogModule
    ],
  exports: [
    IconSelectComponent
  ]
})
export class WilyIconsModule {

  constructor() {
    if (!FontAwesome) {
      return;
    }

    for (const icon of WilyIconsLight.icons) {
      FontAwesome.library.add(icon);
    }

    for (const icon of WilyIconsRegular.icons) {
      FontAwesome.library.add(icon);
    }

    for (const icon of WilyIconsSolid.icons) {
      FontAwesome.library.add(icon);
    }
  }

}
