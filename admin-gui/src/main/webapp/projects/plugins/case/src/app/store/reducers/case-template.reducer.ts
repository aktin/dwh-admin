import { CaseActions, CaseActionTypes } from "../actions/case.actions";
import { CaseTemplateEntity } from "../state";

export function caseTemplatesReducer(
  state = CaseTemplateEntity.initialState,
  action: CaseActions,
): CaseTemplateEntity.State {
  switch (action.type) {
    case CaseActionTypes.CaseTemplateUpdated: {
      return CaseTemplateEntity.adapter.addAll(action.payload.caseTemplates, state);
    }

    case CaseActionTypes.CaseTemplateList: {
      return CaseTemplateEntity.adapter.addAll(action.payload.caseTemplates, state);
    }

    default: {
      return state;
    }
  }
}
