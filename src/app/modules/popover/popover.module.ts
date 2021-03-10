import { A11yModule } from '@angular/cdk/a11y';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverComponent} from './popover.component';

@NgModule({
  declarations: [PopoverComponent],
    imports: [
        CommonModule,
        A11yModule
    ],
  exports: [PopoverComponent]
})
export class WilyPopoverModule { }
