import {Component, OnInit} from '@angular/core';
import {StatusService} from "./status.service";

interface StatsData {
  year: number;
  count: number;
  source: string;
}

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

  private loadStats() : void {
    this._statusService.getStats().subscribe({
      next: (statsData: StatsData[]) => {
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

  private transformStatsData(statsData : StatsData[]) : TableRow[] {
    const groupedByYear = statsData.reduce((acc, item) => {
      if (!acc[item.year]) {
        acc[item.year] = {year: item.year, FALL: 0, FAB: 0, ICD: 0, OPS: 0};
      }

      if (['FALL', 'FAB', 'ICD', 'OPS'].includes(item.source)) {
        acc[item.year][item.source as keyof Omit<TableRow, 'year'>] = item.count;
      }

      return acc
    }, {} as {[year:number] : TableRow});

    return Object.values(groupedByYear).sort((a, b) => b.year - a.year);
  }

  retry() : void {
    this.isLoadingStats = true;
    this.hasError = false;
    this.loadStats();
  }

}