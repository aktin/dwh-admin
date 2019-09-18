import { Permission } from "@app/auth/permission";
import { User } from "@app/auth/models/user";

export interface AuthState {
  permissions: Permission[];
  currentUser: User | null;
}

export const authState: AuthState = {
  permissions: [],
  currentUser: null,
};
