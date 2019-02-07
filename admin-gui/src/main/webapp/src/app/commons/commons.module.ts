import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { ParseExtrasService } from "./parse-extras.service";
import { ExtraModulesComponent } from "./extra-modules/extra-modules.component";

@NgModule({
  declarations: [ExtraModulesComponent],
  imports: [HttpClientModule],
  providers: [ParseExtrasService],
  exports: [ExtraModulesComponent]
})
export class CommonsModule {}
export { HttpClientModule } from "@angular/common/http";
export { HttpClient } from "@angular/common/http";
export { ParseExtrasService } from "./parse-extras.service";
export { ExtraModulesComponent } from "./extra-modules/extra-modules.component";
