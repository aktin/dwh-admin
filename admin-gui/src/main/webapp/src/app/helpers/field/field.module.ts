import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorMessageComponent } from './error-message.component';
import { FieldComponent } from './field.component';



@NgModule({
  declarations: [
    ErrorMessageComponent,
    FieldComponent
  ],
  exports: [
    ErrorMessageComponent,
    FieldComponent
  ],
  imports: [
    CommonModule
  ]
})
export class FieldModule { }
