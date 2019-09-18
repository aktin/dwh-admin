import { AuthState, authState } from "../state/auth.state";
import { AuthActions } from "../actions/auth.actions";

export function reducer(state = authState, action: AuthActions): AuthState {
  switch (action.type) {
    default:
      return state;
  }
}
