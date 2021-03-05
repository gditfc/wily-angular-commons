import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectComponent } from './multi-select.component';

@NgModule({
  declarations: [MultiSelectComponent],
  imports: [
    CommonModule
  ],
  entryComponents: [MultiSelectComponent]
})
export class MultiSelectModule { }
