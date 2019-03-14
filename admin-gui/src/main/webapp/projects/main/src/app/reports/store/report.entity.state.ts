import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { Report } from "../models/report.interface";
import { ReportTemplate } from "@app/reports/models/report-template.interface";

export interface ReportEntityState extends EntityState<Report> {
  selectedId: string | null;
}

export const reportEntityAdapter: EntityAdapter<Report> = createEntityAdapter<Report>();

export const reportEntityState: ReportEntityState = reportEntityAdapter.getInitialState({
  selectedId: null,
});

export interface ReportTemplateEntityState extends EntityState<ReportTemplate> {
  selectedTemplateId: string | null;
}

export const reportTemplateEntityAdapter: EntityAdapter<ReportTemplate> = createEntityAdapter<
  ReportTemplate
>();

export const reportTemplateEntityState: ReportTemplateEntityState = reportTemplateEntityAdapter.getInitialState(
  {
    selectedTemplateId: null,
  },
);
