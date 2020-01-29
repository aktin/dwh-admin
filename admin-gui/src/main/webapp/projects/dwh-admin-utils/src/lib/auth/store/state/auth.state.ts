import { User, Permission } from "../../models";

export interface AuthState {
    permissions: Permission[];
    currentUser: User | null;
    timer : Date;
}

export const authState: AuthState = {
    permissions: [],
    currentUser: null,
    timer: null,
};
