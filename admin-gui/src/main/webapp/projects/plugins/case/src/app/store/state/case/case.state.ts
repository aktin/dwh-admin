import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { Case } from "../../../models";

export interface State extends EntityState<Case> {
  // additional entities state properties
  selectedId: string | number | null;
}

export const adapter: EntityAdapter<Case> = createEntityAdapter<Case>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectedId: null,
});

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
