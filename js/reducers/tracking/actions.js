import { constants } from './constants';

export const setActionsList = function(truck_actions_list) {
  return {
    type: constants.SET_ACTIONS_LIST,
    truck_actions_list: truck_actions_list
  };
};

export const appendToActionList = function(truck_action) {
  return {
    type: constants.APPEND_ACTIONS_LIST,
    truck_action: truck_action
  };
};

export const setCurrentActionsList = function(current_actions_list) {
  return {
    type: constants.SET_CURRENT_ACTIONS_LIST,
    current_actions_list: current_actions_list
  };
};

export const setIsTrackingMoleculesRestoring = function(isTrackingMoleculesRestoring) {
  return {
    type: constants.SET_IS_TRACKING_MOLECULES_RESTORING,
    isTrackingMoleculesRestoring: isTrackingMoleculesRestoring
  };
};

export const setIsTrackingCompoundsRestoring = function(isTrackingCompoundsRestoring) {
  return {
    type: constants.SET_IS_TRACKING_COMPOUNDS_RESTORING,
    isTrackingCompoundsRestoring: isTrackingCompoundsRestoring
  };
};

export const setIsUndoRedoAction = function(isUndoRedoAction) {
  return {
    type: constants.SET_IS_UNDO_REDO_ACTION,
    isUndoRedoAction: isUndoRedoAction
  };
};

export const setIsActionsSending = function(isActionsSending) {
  return {
    type: constants.SET_IS_ACTIONS_SENDING,
    isActionsSending: isActionsSending
  };
};

export const setIsActionsLoading = function(isActionsLoading) {
  return {
    type: constants.SET_IS_ACTIONS_LOADING,
    isActionsLoading: isActionsLoading
  };
};

export const setSendActionsList = function(truck_actions_list) {
  return {
    type: constants.SET_SEND_ACTIONS_LIST,
    send_actions_list: truck_actions_list
  };
};

export const appendToSendActionList = function(truck_action) {
  return {
    type: constants.APPEND_SEND_ACTIONS_LIST,
    truck_action: truck_action
  };
};

export const setProjectActionList = function(project_actions_list) {
  return {
    type: constants.SET_PROJECT_ACTIONS_LIST,
    project_actions_list: project_actions_list
  };
};

export const setIsActionsSaving = function(isActionSaving) {
  return {
    type: constants.SET_IS_ACTIONS_SAVING,
    isActionSaving: isActionSaving
  };
};

export const setIsActionsRestoring = function(isActionRestoring) {
  return {
    type: constants.SET_IS_ACTIONS_RESTORING,
    isActionRestoring: isActionRestoring
  };
};
