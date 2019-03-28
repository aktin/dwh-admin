import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { ReportTemplate } from "../../../models";

export interface State extends EntityState<ReportTemplate> {
  // additional entities state properties
  selectedId: string | number | null;
}

export const adapter: EntityAdapter<ReportTemplate> = createEntityAdapter<ReportTemplate>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectedId: null,
});

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
