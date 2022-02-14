import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { WilyColorPickerModule } from './modules/color-picker/color-picker.module';
import { WilyKeyfilterModule } from './modules/keyfilter/keyfilter.module';
import { WilyMultiSelectModule } from './modules/multi-select/multi-select.module';
import { WilyOrdinalNumberPipeModule } from './modules/ordinal-number-pipe/ordinal-number-pipe.module';
import { WilyProfilePicModule } from './modules/profile-pic/wily-profile-pic.module';
import { WilyPaginatorModule } from './modules/paginator/wily-paginator.module';
import { WilyPushContainerModule } from './modules/push-container/wily-push-container.module';
import { WilyRichTextModule } from './modules/rich-text/wily-rich-text.module';
import { WilyIconsModule } from './modules/icons/wily-icons.module';
import { FormsModule } from '@angular/forms';
import { WilyEndpointStateModule } from './modules/endpoint-state/endpoint-state.module';
import { WilyDialogModule } from './modules/dialog/dialog.module';
import { WilyDatePickerModule } from './modules/date-picker/date-picker.module';
import { WilySliderModule } from './modules/slider/slider.module';
import { WilyWeekPickerModule } from './modules/week-picker/week-picker.module';
import { WilyDropdownModule } from './modules/dropdown/dropdown.module';
import { WilyTooltipModule } from './modules/tooltip/tooltip.module';
import { WilyNotificationModule } from './modules/notification/notification.module';
import { WilyPopoverModule } from './modules/popover/popover.module';
import {WilyNewTabWarningModule} from './modules/new-tab-warning/wily-new-tab-warning.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    WilyTooltipModule,
    WilyDialogModule,
    WilyProfilePicModule,
    WilyPaginatorModule,
    WilyPushContainerModule,
    WilyRichTextModule,
    WilyIconsModule,
    WilyEndpointStateModule,
    WilyDatePickerModule,
    WilyWeekPickerModule,
    WilyDropdownModule,
    WilyNotificationModule,
    WilyPopoverModule,
    WilyMultiSelectModule,
    WilyKeyfilterModule,
    WilyColorPickerModule,
    WilySliderModule,
    WilyOrdinalNumberPipeModule,
    WilyNewTabWarningModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
