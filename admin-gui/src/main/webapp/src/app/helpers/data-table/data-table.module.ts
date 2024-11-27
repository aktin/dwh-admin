import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SortableTableColumnDirective} from "./sortable-table-column/sortable-table-column.directive";
import {DataTableComponent} from "./data-table.component";
import {NgxPaginationModule} from "ngx-pagination";
import {TemplateVarDirective} from '../directives/template-var.directive';
import {AppModule} from '../../app.module';


@NgModule({
  declarations: [
    SortableTableColumnDirective,
    DataTableComponent
  ],
  exports: [
    DataTableComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    TemplateVarDirective
  ]
})
export class DataTableModule { }
