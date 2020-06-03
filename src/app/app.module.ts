import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {DialogLegacyModule} from './modules/dialog-legacy/dialog-legacy.module';
import {WilyProfilePicModule} from './modules/profile-pic/wily-profile-pic.module';
import {TooltipModule} from 'primeng/tooltip';
import {WilyPaginatorModule} from './modules/paginator/wily-paginator.module';
import {WilyPushContainerModule} from './modules/push-container/wily-push-container.module';
import {WilyRichTextModule} from './modules/rich-text/wily-rich-text.module';
import {WilyIconsModule} from './modules/icons/wily-icons.module';
import {FormsModule} from '@angular/forms';
import {WilyEndpointStateModule} from './modules/endpoint-state/endpoint-state.module';
import {DialogModule} from './modules/dialog/dialog.module';


@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        TooltipModule,
        DialogLegacyModule,
        DialogModule,
        WilyProfilePicModule,
        WilyPaginatorModule,
        WilyPushContainerModule,
        WilyRichTextModule,
        WilyIconsModule,
        FormsModule,
        WilyEndpointStateModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
