import { CaseStatus } from "./case-status.enum";

export interface Case {
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
  state: CaseStatus;
  url?: string;
  name?: string;
}
