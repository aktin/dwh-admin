import { NgModule } from "@angular/core";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { ParseExtrasService } from "./parse-extras.service";
import { ExtraModulesComponent } from "./extra-modules/extra-modules.component";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [ExtraModulesComponent],
  imports: [CommonModule, HttpClientModule],
  exports: [HttpClientModule, ExtraModulesComponent]
})
export class CommonsModule {
  static forRoot() {
    return {
      ngModule: CommonsModule,
      providers: [ParseExtrasService]
    };
  }
}
// export { HttpClientModule } from "@angular/common/http";
// export { HttpClient } from "@angular/common/http";
// export { ParseExtrasService } from "./parse-extras.service";
// export { ExtraModulesComponent } from "./extra-modules/extra-modules.component";
