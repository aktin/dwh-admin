import { Permission } from "../../permission";
import { User } from "../../models/user";

export interface AuthState {
  permissions: Permission[];
  currentUser: User | null;
}

export const authState: AuthState = {
  permissions: [],
  currentUser: null,
};
