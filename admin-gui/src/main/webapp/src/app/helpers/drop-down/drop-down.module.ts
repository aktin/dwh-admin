import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DropDownComponent} from "./drop-down.component";
import { DropDownOptionComponent } from './drop-down-option/drop-down-option.component';
import { DropDownDirective } from './drop-down.directive';



@NgModule({
  declarations: [DropDownComponent, DropDownOptionComponent, DropDownDirective],
  exports: [DropDownComponent, DropDownOptionComponent, DropDownDirective],
  imports: [
    CommonModule
  ]
})
export class DropDownModule { }
