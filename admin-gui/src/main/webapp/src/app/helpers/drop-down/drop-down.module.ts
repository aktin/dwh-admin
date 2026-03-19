import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DropDownComponent} from "./drop-down.component";
import { DropDownOptionComponent } from './drop-down-option/drop-down-option.component';



@NgModule({
  declarations: [DropDownComponent, DropDownOptionComponent],
  exports: [DropDownComponent, DropDownOptionComponent],
  imports: [
    CommonModule
  ]
})
export class DropDownModule { }
