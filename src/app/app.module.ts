import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {WilyDialogLegacyModule} from './modules/dialog-legacy/dialog-legacy.module';
import { MultiSelectModule } from './modules/multi-select/multi-select.module';
import {WilyProfilePicModule} from './modules/profile-pic/wily-profile-pic.module';
import {WilyPaginatorModule} from './modules/paginator/wily-paginator.module';
import {WilyPushContainerModule} from './modules/push-container/wily-push-container.module';
import {WilyRichTextModule} from './modules/rich-text/wily-rich-text.module';
import {WilyIconsModule} from './modules/icons/wily-icons.module';
import {FormsModule} from '@angular/forms';
import {WilyEndpointStateModule} from './modules/endpoint-state/endpoint-state.module';
import {WilyDialogModule} from './modules/dialog/dialog.module';
import { DatePickerModule } from './modules/date-picker/date-picker.module';
import { DropdownModule } from './modules/dropdown/dropdown.module';
import { TooltipModule } from './modules/tooltip/tooltip.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PopoverModule} from './modules/popover/popover.module';


@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        TooltipModule,
        WilyDialogLegacyModule,
        WilyDialogModule,
        WilyProfilePicModule,
        WilyPaginatorModule,
        WilyPushContainerModule,
        WilyRichTextModule,
        WilyIconsModule,
        FormsModule,
        WilyEndpointStateModule,
        DatePickerModule,
        DropdownModule,
        TooltipModule,
        NotificationModule,
        PopoverModule,
        MultiSelectModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
