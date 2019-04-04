import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MatButtonModule,
  MatMenuModule,
  MatIconModule,
  MatCardModule,
  MatSidenavModule,
  MatFormFieldModule,
  MatListModule,
  MatInputModule,
  MatTooltipModule,
  MatToolbarModule,
} from "@angular/material";

const MATERIALMODULES = [
  CommonModule,
  MatButtonModule,
  MatMenuModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatSidenavModule,
  MatFormFieldModule,
  MatInputModule,
  MatTooltipModule,
  MatToolbarModule,
];

@NgModule({
  declarations: [],
  imports: MATERIALMODULES,
  exports: MATERIALMODULES,
})
export class MaterialModule {}
