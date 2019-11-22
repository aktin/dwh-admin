import { CaseActions, CaseActionTypes } from "../actions/case.actions";
import { CaseEntity } from "../state";

export function caseReducer(
  state = CaseEntity.initialState,
  action: CaseActions,
): CaseEntity.State {
  switch (action.type) {
    case CaseActionTypes.CasesUpdated: {
      return CaseEntity.adapter.addAll(action.payload.cases, state);
    }

    case CaseActionTypes.CasesList: {
      return CaseEntity.adapter.addAll(action.payload.cases, state);
    }

    default: {
      return state;
    }
  }
}
