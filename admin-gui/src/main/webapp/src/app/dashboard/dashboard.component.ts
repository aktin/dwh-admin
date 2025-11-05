import { Component, ElementRef, OnInit } from '@angular/core';

import { DashboardService } from './dashboard.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  /**
   * @param { ElementRef } elementRef
   * @param { DashboardService } embedService
   */
  constructor(private elementRef: ElementRef,
    private embedService: DashboardService) {}

  ngOnInit(): void {
    this.embedDashboard();
  }

  embedDashboard(): void {
    const dashboardElement = this.elementRef.nativeElement.querySelector('#dashboard');

    if (dashboardElement) {
      this.embedService.embedDashboard().subscribe({
            next: () => {
              const iframe = dashboardElement.querySelector('iframe');
              if (iframe) {
                iframe.setAttribute('scrolling', 'no');
              }
            },
            error: (error) => {
              console.error(error);
            }
          }
      );
    }
  }
}