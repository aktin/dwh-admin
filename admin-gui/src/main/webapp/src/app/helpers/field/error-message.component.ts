import { Component } from '@angular/core';

@Component({
  selector: 'error-message',
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.css',
  host: {
    class: 'error-message',
  }
})
export class ErrorMessageComponent {
}
