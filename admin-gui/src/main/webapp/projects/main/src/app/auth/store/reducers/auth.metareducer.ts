import { LocalStorageService, storageMetaReducer } from "@aktin/utils";

export function getAuthConfig(saveKeys: string[], localStorageKey: string, storageService: LocalStorageService) {
    return {metaReducers: [storageMetaReducer(saveKeys, localStorageKey, storageService)]};
}

export const saveKeys = ["currentUser", "permissions"];
export const localStorageKey = "__auth_storage__";
