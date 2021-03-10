import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WilySafePipesModule} from '../safe-pipes/wily-safe-pipes.module';
import {ProfilePicComponent} from './profile-pic.component';
import {WilyTooltipModule} from "../tooltip/tooltip.module";

@NgModule({
  declarations: [
    ProfilePicComponent
  ],
    imports: [
        CommonModule,
        WilySafePipesModule,
        WilyTooltipModule
    ],
  exports: [
    ProfilePicComponent
  ]
})
export class WilyProfilePicModule {
}
