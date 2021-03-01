import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent} from './dropdown.component';
import { DropdownOptionComponent } from './components/dropdown-option/dropdown-option.component';
import { DropdownOptgroupComponent } from './components/dropdown-optgroup/dropdown-optgroup.component';

@NgModule({
  declarations: [
    DropdownComponent,
    DropdownOptionComponent,
    DropdownOptgroupComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DropdownComponent,
    DropdownOptionComponent,
    DropdownOptgroupComponent
  ]
})
export class DropdownModule { }
