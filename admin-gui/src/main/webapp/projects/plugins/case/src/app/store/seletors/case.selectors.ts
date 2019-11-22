import { CaseEntity, CaseTemplateEntity, CaseState } from "../state";
import { createFeatureSelector, createSelector } from "@ngrx/store";
// Appstate -> CaseState
export const selectCaseState = createFeatureSelector<CaseState>("cases");

// CaseState -> CaseEntity
export const getCasesEntity = createSelector(
    selectCaseState,
    (state: CaseState) => state.cases,
);
export const getCasesAsArray = createSelector(
    getCasesEntity,
    CaseEntity.selectAll,
);
export const getCasesCount = createSelector(
    getCasesEntity,
    CaseEntity.selectTotal,
);

export const getSelectedCaseId = (state: CaseEntity.State) => state.selectedId;
export const getSelectedTemplateId = (state: CaseTemplateEntity.State) => state.selectedId;
export const selectCurrentCaseId = createSelector(
    getCasesEntity,
    getSelectedCaseId,
);

// CaseState -> CasetemplateEntity
export const getCaseTemplatesEntity = createSelector(
    selectCaseState,
    (state: CaseState) => state.caseTemplates,
);
