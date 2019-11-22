import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { CaseTemplate } from "../../../models";

export interface State extends EntityState<CaseTemplate> {
  // additional entities state properties
  selectedId: string | number | null;
}

export const adapter: EntityAdapter<CaseTemplate> = createEntityAdapter<CaseTemplate>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectedId: null,
});

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
