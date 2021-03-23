import { A11yModule } from '@angular/cdk/a11y';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WilyOrdinalNumberPipeModule } from '../ordinal-number-pipe/ordinal-number-pipe.module';
import { WilyPopoverModule } from '../popover/popover.module';
import { WeekPickerComponent } from './week-picker.component';
import {WilyTooltipModule} from '../tooltip/tooltip.module';

@NgModule({
  declarations: [WeekPickerComponent],
    imports: [
        CommonModule,
        WilyOrdinalNumberPipeModule,
        FormsModule,
        A11yModule,
        WilyPopoverModule,
        WilyTooltipModule
    ],
  exports: [WeekPickerComponent]
})
export class WilyWeekPickerModule { }
