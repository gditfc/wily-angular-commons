import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WilyIconsRegular} from './wily-icons-regular.model';
import {WilyIconsLight} from './wily-icons-light.model';

const FontAwesome = window['FontAwesome'];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: []
})
export class WilyIconsModule {

  constructor() {
    if (!FontAwesome) {
      return;
    }

    FontAwesome.library.add(
      WilyIconsRegular.wirAddress,
      WilyIconsRegular.wirAlphaText,
      WilyIconsRegular.wirCheckbox,
      WilyIconsRegular.wirDate,
      WilyIconsRegular.wirDateRange,
      WilyIconsRegular.wirDocumentUpload,
      WilyIconsRegular.wirDropdown,
      WilyIconsRegular.wirEmail,
      WilyIconsRegular.wirFEIN,
      WilyIconsRegular.wirHTML,
      WilyIconsRegular.wirLicense,
      WilyIconsRegular.wirMMISNPI,
      WilyIconsRegular.wirMoney,
      WilyIconsRegular.wirMultiSelect,
      WilyIconsRegular.wirNPI,
      WilyIconsRegular.wirNumericText,
      WilyIconsRegular.wirPersonName,
      WilyIconsRegular.wirPhone,
      WilyIconsRegular.wirPID,
      WilyIconsRegular.wirRadioButtons,
      WilyIconsRegular.wirSSN,
      WilyIconsRegular.wirTextArea,
      WilyIconsRegular.wirTextBox
    );

    FontAwesome.library.add(
      WilyIconsLight.wilAddress,
      WilyIconsLight.wilAlphaText,
      WilyIconsLight.wilCheckbox,
      WilyIconsLight.wilDate,
      WilyIconsLight.wilDateRange,
      WilyIconsLight.wilDocumentUpload,
      WilyIconsLight.wilDropdown,
      WilyIconsLight.wilEmail,
      WilyIconsLight.wilFEIN,
      WilyIconsLight.wilHTML,
      WilyIconsLight.wilLicense,
      WilyIconsLight.wilMMISNPI,
      WilyIconsLight.wilMoney,
      WilyIconsLight.wilMultiSelect,
      WilyIconsLight.wilNPI,
      WilyIconsLight.wilNumericText,
      WilyIconsLight.wilPersonName,
      WilyIconsLight.wilPhone,
      WilyIconsLight.wilPID,
      WilyIconsLight.wilRadioButtons,
      WilyIconsLight.wilSSN,
      WilyIconsLight.wilTextArea,
      WilyIconsLight.wilTextBox
    );
  }

}
