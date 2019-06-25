import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WilySafePipesModule} from '../safe-pipes/wily-safe-pipes.module';
import {TooltipModule} from 'primeng/tooltip';
import {ProfilePicComponent} from './profile-pic.component';

@NgModule({
  declarations: [
    ProfilePicComponent
  ],
  imports: [
    CommonModule,
    WilySafePipesModule,
    TooltipModule
  ],
  exports: [
    ProfilePicComponent
  ]
})
export class WilyProfilePicModule {
}
