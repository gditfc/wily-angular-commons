import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HelpWidgetModule} from './modules/help-widget/help-widget.module';
import {ThemingModule} from './modules/theming/theming.module';
import {WilyDialogModule} from './modules/wily-dialog/wily-dialog.module';
import {IconSelectModule} from './modules/icon-select/icon-select.module';
import {ProfilePicModule} from './modules/profile-pic/profile-pic.module';
import {TooltipModule} from 'primeng/primeng';
import {PaginatorModule} from './modules/paginator/paginator.module';
import {PushContainerModule} from './modules/push-container/push-container.module';
import {RichTextModule} from './modules/rich-text/rich-text.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HelpWidgetModule,
    IconSelectModule,
    ThemingModule,
    WilyDialogModule,
    ProfilePicModule,
    TooltipModule,
    PaginatorModule,
    PushContainerModule,
    RichTextModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
