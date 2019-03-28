import { Action } from "@ngrx/store";

export interface PluginsState {
  names: string[];
  plugins: { [name: string]: AbstractPluginState };
}

export const pluginsState: PluginsState = {
  names: [],
  plugins: {},
};

export interface AbstractPluginState {}

export enum PluginsActionTypes {
  AddPlugins = "[Plugins] Add Plugins",
}
export class AddPlugin implements Action {
  readonly type = PluginsActionTypes.AddPlugins;

  constructor(public payload: { plugin: AbstractPluginState; name: string }) {}
}

export type PluginsActions = AddPlugin;

export function pluginReducer(state = pluginsState, action: PluginsActions): PluginsState {
  switch (action.type) {
    case PluginsActionTypes.AddPlugins: {
      state.names.push(action.payload.name);
      state.plugins[action.payload.name] = action.payload.plugin;
      return state;
    }
    default: {
      return state;
    }
  }
}
