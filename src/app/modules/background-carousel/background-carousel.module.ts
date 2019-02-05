import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BackgroundCarouselDirective} from './background-carousel.directive';

@NgModule({
  declarations: [
    BackgroundCarouselDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BackgroundCarouselDirective
  ]
})
export class BackgroundCarouselModule {
}
