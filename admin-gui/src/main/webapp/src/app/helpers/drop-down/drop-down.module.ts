import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DropDownComponent} from "./drop-down.component";
import { DropDownOptionComponent } from './drop-down-option/drop-down-option.component';
import { DropDownOptionGroupComponent } from './drop-down-option-group/drop-down-option-group.component';



@NgModule({
  declarations: [DropDownComponent, DropDownOptionComponent, DropDownOptionGroupComponent],
    exports: [DropDownComponent, DropDownOptionComponent, DropDownOptionGroupComponent],
  imports: [
    CommonModule
  ]
})
export class DropDownModule { }
