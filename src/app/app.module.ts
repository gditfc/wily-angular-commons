import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {WilyDialogModule} from './modules/dialog/wily-dialog.module';
import {WilyProfilePicModule} from './modules/profile-pic/wily-profile-pic.module';
import {TooltipModule} from 'primeng/tooltip';
import {WilyPaginatorModule} from './modules/paginator/wily-paginator.module';
import {WilyPushContainerModule} from './modules/push-container/wily-push-container.module';
import {WilyRichTextModule} from './modules/rich-text/wily-rich-text.module';
import {WilyIconsModule} from './modules/icons/wily-icons.module';
import {FormsModule} from '@angular/forms';
import {WilyEndpointStateModule} from './modules/endpoint-state/endpoint-state.module';
import { WilyFlexDialogComponent } from './modules/wily-flex-dialog/wily-flex-dialog/wily-flex-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    WilyFlexDialogComponent
  ],
    imports: [
        BrowserModule,
        TooltipModule,
        WilyDialogModule,
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
