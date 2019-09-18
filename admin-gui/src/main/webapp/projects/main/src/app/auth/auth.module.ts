import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthLoginComponent } from "./components/auth-login/auth-login.component";
import { FormsModule } from "@angular/forms";

const AUTHCOMPONENTS = [AuthLoginComponent];

@NgModule({
  declarations: AUTHCOMPONENTS,
  entryComponents: AUTHCOMPONENTS,
  imports: [CommonModule, FormsModule],
  exports: [AuthLoginComponent],
})
export class AuthModule {}
