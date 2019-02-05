import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SafePipesModule} from '../safe-pipes/safe-pipes.module';
import {TooltipModule} from 'primeng/primeng';
import {ProfilePicComponent} from './profile-pic.component';

@NgModule({
  declarations: [
    ProfilePicComponent
  ],
  imports: [
    CommonModule,
    SafePipesModule,
    TooltipModule
  ],
  exports: [
    ProfilePicComponent
  ]
})
export class ProfilePicModule {
}
