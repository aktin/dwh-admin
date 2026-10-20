import {Component, OnInit} from '@angular/core';
import {StatusService} from "./status.service";

interface TableRow {
  year: number;
  FALL: number;
  FAB: number;
  ICD: number;
  OPS: number;
}

@Component({
  selector: 'app-stats-table',
  templateUrl: './stats-table.component.html',
})
export class StatsTableComponent implements OnInit {
  statsTable: TableRow[];
  isLoadingStats = true;
  hasError = false;

  constructor(private _statusService: StatusService) {
  }

  ngOnInit() {
    this.loadStats();
  }

  private loadStats(): void {
    this._statusService.getStats().subscribe({
      next: (statsData: Record<string, string>) => {
        this.statsTable = this.transformStatsData(statsData);
        this.isLoadingStats = false;
        this.hasError = false;
      },
      error: (error) => {
        console.error('Error loading stats', error);
        this.isLoadingStats = false;
        this.hasError = true;
      }
    })
  }

  private transformStatsData(statsData: Record<string, string>): TableRow[] {
    const groupedByYear: { [year: number]: TableRow } = {};

    for (const [key, value] of Object.entries(statsData)) {
      const [source, yearStr] = key.split('.');
      const year = parseInt(yearStr, 10);
      const count = parseInt(value, 10);

      if (isNaN(year) || isNaN(count)) {
        continue;
      }

      if (!groupedByYear[year]) {
        groupedByYear[year] = {year, FALL: 0, FAB: 0, ICD: 0, OPS: 0};
      }

      if (['FALL', 'FAB', 'ICD', 'OPS'].includes(source)) {
        groupedByYear[year][source as keyof Omit<TableRow, 'year'>] = count;
      }
    }

    return Object.values(groupedByYear).sort((a, b) => b.year - a.year);
  }

  retry(): void {
    this.isLoadingStats = true;
    this.hasError = false;
    this.loadStats();
  }
}