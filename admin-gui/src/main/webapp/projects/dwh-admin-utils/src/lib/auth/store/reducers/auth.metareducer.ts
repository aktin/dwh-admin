import { LocalStorageService } from "../../../services";
import { storageMetaReducer } from "../../../state";

export function getAuthConfig(saveKeys: string[], localStorageKey: string, storageService: LocalStorageService) {
    return {metaReducers: [storageMetaReducer(saveKeys, localStorageKey, storageService)]};
}

export const saveKeys = ["currentUser", "permissions"];
export const localStorageKey = "__auth_storage__";
