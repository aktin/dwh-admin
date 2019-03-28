import { ReportStatus } from "./report-status.enum";

export interface Report {
  id: number;
  created: Date;
  generationDate: Date; // if not null: report generation date
  data: string;
  timespan: Date[];
  start: string;
  end: string;
  template: string;
  type: string;
  status: string;
  state: ReportStatus;
  url?: string;
  name?: string;
}
