import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorMessageComponent } from './error-message.component';
import { FieldComponent } from './field.component';
import { HelpTextComponent } from './help-text.component';



@NgModule({
  declarations: [
    ErrorMessageComponent,
    FieldComponent,
    HelpTextComponent
  ],
  exports: [
    ErrorMessageComponent,
    FieldComponent,
    HelpTextComponent
  ],
  imports: [
    CommonModule
  ]
})
export class FieldModule { }
