import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { Report } from "@app/reports/models";

export interface State extends EntityState<Report> {
  // additional entities state properties
  selectedId: string | number | null;
}

export const adapter: EntityAdapter<Report> = createEntityAdapter<Report>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectedId: null,
});

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
