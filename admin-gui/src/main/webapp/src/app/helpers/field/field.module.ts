import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorMessageComponent } from './error-message.component';
import { FieldComponent } from './field.component';
import { InitialFormDirective } from './initial-form.directive';



@NgModule({
  declarations: [
    ErrorMessageComponent,
    FieldComponent,
    InitialFormDirective
  ],
  exports: [
    ErrorMessageComponent,
    FieldComponent,
    InitialFormDirective
  ],
  imports: [
    CommonModule
  ]
})
export class FieldModule { }
