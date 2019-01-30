import { Component } from "@angular/core";

@Component({
  selector: "admin-gui-root",
  template: `
    <div>header</div>
    <div>menu</div>
    <div>
      <div>body</div>
      <router-outlet></router-outlet>
    </div>
    <!--<div>footer</div>-->
  `,
  styles: []
})
export class AppComponent {
  title = "aktin-dwh-admin-gui";
}
