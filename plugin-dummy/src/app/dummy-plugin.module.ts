import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DummyPluginComponent } from './dummy-plugin.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DummyPluginComponent],
  entryComponents: [DummyPluginComponent],
  providers: [{
     provide: 'plugins',
     useValue: [{
       name: 'dummy-plugin-component',
       component: DummyPluginComponent
     }],
     multi: true
   }]
})
export class DummyPluginModule { }
