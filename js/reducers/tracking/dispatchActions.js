import {
  setCurrentActionsList,
  setIsTrackingMoleculesRestoring,
  setIsTrackingCompoundsRestoring,
  setIsUndoRedoAction
} from './actions';
import { actionType, actionObjectType } from './constants';
import { VIEWS } from '../../../js/constants/constants';
import { setCurrentVector, appendToBuyList, removeFromToBuyList } from '../selection/actions';
import { unmountPreviewComponent, shouldLoadProtein } from '../../components/preview/redux/dispatchActions';
import {
  selectMoleculeGroup,
  onDeselectMoleculeGroup,
  loadMoleculeGroupsOfTarget
} from '../../components/preview/moleculeGroups/redux/dispatchActions';
import { resetTargetState, setTargetOn } from '../api/actions';
import {
  addComplex,
  addLigand,
  addHitProtein,
  addSurface,
  addVector,
  removeComplex,
  removeLigand,
  removeHitProtein,
  removeSurface,
  removeVector
} from '../../components/preview/molecule/redux/dispatchActions';
import { colourList } from '../../components/preview/molecule/moleculeView';
import {
  addDatasetComplex,
  addDatasetLigand,
  addDatasetHitProtein,
  addDatasetSurface,
  removeDatasetComplex,
  removeDatasetLigand,
  removeDatasetHitProtein,
  removeDatasetSurface,
  loadDataSets,
  loadDatasetCompoundsWithScores
} from '../../components/datasets/redux/dispatchActions';
import {
  appendMoleculeToCompoundsOfDatasetToBuy,
  removeMoleculeFromCompoundsOfDatasetToBuy,
  setMoleculeListIsLoading
} from '../../components/datasets/redux/actions';
import { setAllMolLists } from '../api/actions';
import { getUrl, loadAllMolsFromMolGroup } from '../../../js/utils/genericList';
import {
  removeComponentRepresentation,
  addComponentRepresentation,
  updateComponentRepresentation
} from '../../../js/reducers/ngl/actions';
import * as listType from '../../constants/listTypes';
import { assignRepresentationToComp } from '../../components/nglView/generatingObjects';
import { deleteObject } from '../../../js/reducers/ngl/dispatchActions';
import { setSendActionsList, setIsActionsSending, setIsActionsLoading, setActionsList } from './actions';
import { api, METHOD } from '../../../js/utils/api';
import { base_url } from '../../components/routes/constants';
import { CONSTANTS } from '../../../js/constants/constants';
import moment from 'moment';
import { appendToActionList, appendToSendActionList, setProjectActionList } from './actions';

export const selectCurrentActionsList = () => (dispatch, getState) => {
  const state = getState();

  const actionList = state.trackingReducers.truck_actions_list;
  const currentTargetOn = state.apiReducers.target_on;
  const currentSites = state.selectionReducers.mol_group_selection;
  const currentLigands = state.selectionReducers.fragmentDisplayList;
  const currentProteins = state.selectionReducers.proteinList;
  const currentComplexes = state.selectionReducers.complexLists;
  const currentSurfaces = state.selectionReducers.surfaceList;
  const currentVectors = state.selectionReducers.vectorOnList;
  const currentBuyList = state.selectionReducers.to_buy_list;
  const currentVector = state.selectionReducers.currentVector;

  const currentDatasetLigands = state.datasetsReducers.ligandLists;
  const currentDatasetProteins = state.datasetsReducers.proteinList;
  const currentDatasetComplexes = state.datasetsReducers.complexLists;
  const currentDatasetSurfaces = state.datasetsReducers.surfaceLists;

  const currentDatasetBuyList = state.datasetsReducers.compoundsToBuyDatasetMap;
  const currentobjectsInView = state.nglReducers.objectsInView;

  const orderedActionList = actionList.reverse((a, b) => a.timestamp - b.timestamp);
  const currentTargets = (currentTargetOn && [currentTargetOn]) || [];
  const currentVectorSmiles = (currentVector && [currentVector]) || [];

  let currentActions = [];

  getCurrentActionList(orderedActionList, actionType.TARGET_LOADED, getCollection(currentTargets), currentActions);
  getCurrentActionList(orderedActionList, actionType.SITE_TURNED_ON, getCollection(currentSites), currentActions);
  getCurrentActionList(orderedActionList, actionType.LIGAND_TURNED_ON, getCollection(currentLigands), currentActions);
  getCurrentActionList(
    orderedActionList,
    actionType.SIDECHAINS_TURNED_ON,
    getCollection(currentProteins),
    currentActions
  );
  getCurrentActionList(
    orderedActionList,
    actionType.INTERACTIONS_TURNED_ON,
    getCollection(currentComplexes),
    currentActions
  );
  getCurrentActionList(orderedActionList, actionType.SURFACE_TURNED_ON, getCollection(currentSurfaces), currentActions);
  getCurrentActionList(orderedActionList, actionType.VECTORS_TURNED_ON, getCollection(currentVectors), currentActions);
  getCurrentActionList(
    orderedActionList,
    actionType.VECTOR_SELECTED,
    getCollection(currentVectorSmiles),
    currentActions
  );

  getCurrentActionList(
    orderedActionList,
    actionType.MOLECULE_ADDED_TO_SHOPPING_CART,
    getCollectionOfShoppingCart(currentBuyList),
    currentActions
  );

  getCurrentActionList(
    orderedActionList,
    actionType.LIGAND_TURNED_ON,
    getCollectionOfDataset(currentDatasetLigands),
    currentActions
  );
  getCurrentActionList(
    orderedActionList,
    actionType.SIDECHAINS_TURNED_ON,
    getCollectionOfDataset(currentDatasetProteins),
    currentActions
  );
  getCurrentActionList(
    orderedActionList,
    actionType.INTERACTIONS_TURNED_ON,
    getCollectionOfDataset(currentDatasetComplexes),

    currentActions
  );
  getCurrentActionList(
    orderedActionList,
    actionType.SURFACE_TURNED_ON,
    getCollectionOfDataset(currentDatasetSurfaces),
    currentActions
  );

  getCurrentActionList(
    orderedActionList,
    actionType.COMPOUND_SELECTED,
    getCollectionOfDataset(currentDatasetBuyList),
    currentActions
  );

  getCurrentActionList(
    orderedActionList,
    actionType.REPRESENTATION_CHANGED,
    getCollectionOfDatasetOfRepresentation(currentobjectsInView),
    currentActions
  );

  dispatch(setCurrentActionsList(currentActions));
};

const getCurrentActionList = (orderedActionList, type, collection, currentActions) => {
  let actionList =
    type !== actionType.REPRESENTATION_CHANGED
      ? orderedActionList.filter(action => action.type === type)
      : orderedActionList.filter(
          action =>
            action.type === actionType.REPRESENTATION_ADDED ||
            action.type === actionType.REPRESENTATION_REMOVED ||
            action.type === actionType.REPRESENTATION_CHANGED
        );
  if (collection) {
    collection.forEach(data => {
      let action = actionList.find(action => action.object_id === data.id && action.dataset_id === data.datasetId);

      if (action) {
        currentActions.push(Object.assign(mapCurrentAction(action)));
      }
    });
  }
};

const mapCurrentAction = action => {
  return Object.assign({
    timestamp: action.timestamp,
    object_name: action.object_name,
    object_type: action.object_type,
    action_type: action.type,
    dataset_id: action.dataset_id
  });
};

const getCollection = dataList => {
  let list = [];
  if (dataList) {
    var result = dataList.map(value => ({ id: value }));
    list.push(...result);
  }
  return list;
};

const getCollectionOfDataset = dataList => {
  let list = [];
  if (dataList) {
    for (const datasetId in dataList) {
      let values = dataList[datasetId];
      if (values) {
        var result = values.map(value => ({ id: value, datasetId: datasetId }));
        list.push(...result);
      }
    }
  }
  return list;
};

const getCollectionOfShoppingCart = dataList => {
  let list = [];
  if (dataList) {
    dataList.forEach(data => {
      let value = data.vector;
      if (value) {
        list.push({ id: value });
      }
    });
  }
  return list;
};

const getCollectionOfDatasetOfRepresentation = dataList => {
  let list = [];
  for (const view in dataList) {
    let objectView = dataList[view];
    if (objectView && objectView !== null && objectView.display_div === VIEWS.MAJOR_VIEW) {
      let value = dataList[view].name;
      if (value) {
        list.push({ id: value });
      }
    }
  }
  return list;
};

export const restoreCurrentActionsList = (stages = []) => (dispatch, getState) => {
  dispatch(setIsTrackingMoleculesRestoring(true));
  dispatch(setIsTrackingCompoundsRestoring(true));
  dispatch(unmountPreviewComponent(stages));
  dispatch(resetTargetState());
  dispatch(restoreStateBySavedActionList(stages));
};

const restoreStateBySavedActionList = stages => (dispatch, getState) => {
  const state = getState();

  const currentActionList = state.trackingReducers.current_actions_list;
  const orderedActionList = currentActionList.sort((a, b) => a.timestamp - b.timestamp);

  dispatch(restoreTargetActions(orderedActionList, stages));
};

const restoreTargetActions = (orderedActionList, stages) => (dispatch, getState) => {
  const state = getState();

  const majorView = stages.find(view => view.id === VIEWS.MAJOR_VIEW);
  const summaryView = stages.find(view => view.id === VIEWS.SUMMARY_VIEW);

  let targetAction = orderedActionList.find(action => action.action_type === actionType.TARGET_LOADED);
  if (targetAction) {
    let target = getTarget(targetAction.object_name, state);
    if (target) {
      dispatch(setTargetOn(target.id));
      dispatch(shouldLoadProtein({ nglViewList: stages, currentSnapshotID: null, isLoadingCurrentSnapshot: false }));

      dispatch(
        loadMoleculeGroupsOfTarget({
          summaryView: summaryView.stage,
          isStateLoaded: false,
          setOldUrl: url => {},
          target_on: target.id
        })
      )
        .catch(error => {
          throw error;
        })
        .finally(() => {
          dispatch(restoreSitesActions(orderedActionList, summaryView));
          dispatch(loadAllMolecules(orderedActionList, target.id, majorView.stage));
        });

      dispatch(loadAllDatasets(orderedActionList, target.id, majorView.stage));
    }
  }
};

const loadAllDatasets = (orderedActionList, target_on, stage) => (dispatch, getState) => {
  dispatch(setMoleculeListIsLoading(true));
  dispatch(loadDataSets(target_on))
    .then(results => {
      return dispatch(loadDatasetCompoundsWithScores());
    })
    .catch(error => {
      throw new Error(error);
    })
    .finally(() => {
      dispatch(restoreCompoundsActions(orderedActionList, stage));
      dispatch(setMoleculeListIsLoading(false));
      dispatch(setIsTrackingCompoundsRestoring(false));
    });
};

const loadAllMolecules = (orderedActionList, target_on, stage) => (dispatch, getState) => {
  const state = getState();
  const list_type = listType.MOLECULE;

  let molGroupList = state.apiReducers.mol_group_list;

  let promises = [];
  molGroupList.forEach(molGroup => {
    let id = molGroup.id;
    let url = getUrl({ list_type, target_on, mol_group_on: id });
    promises.push(
      loadAllMolsFromMolGroup({
        url,
        mol_group: id
      })
    );
  });
  Promise.all(promises)
    .then(results => {
      let listToSet = {};
      results.forEach(molResult => {
        listToSet[molResult.mol_group] = molResult.molecules;
      });
      dispatch(setAllMolLists(listToSet));
      dispatch(restoreMoleculesActions(orderedActionList, stage));
      dispatch(setIsTrackingMoleculesRestoring(false));
    })
    .catch(err => console.log(err));
};

const restoreSitesActions = (orderedActionList, summaryView) => (dispatch, getState) => {
  const state = getState();

  let sitesAction = orderedActionList.filter(action => action.action_type === actionType.SITE_TURNED_ON);
  if (sitesAction) {
    sitesAction.forEach(action => {
      let molGroup = getMolGroup(action.object_name, state);
      if (molGroup) {
        dispatch(selectMoleculeGroup(molGroup, summaryView.stage));
      }
    });
  }
};

const restoreMoleculesActions = (orderedActionList, stage) => (dispatch, getState) => {
  const state = getState();
  let moleculesAction = orderedActionList.filter(
    action => action.object_type === actionObjectType.MOLECULE || action.object_type === actionObjectType.INSPIRATION
  );

  if (moleculesAction) {
    dispatch(addNewType(moleculesAction, actionType.LIGAND_TURNED_ON, 'ligand', stage, state));
    dispatch(addNewType(moleculesAction, actionType.SIDECHAINS_TURNED_ON, 'protein', stage, state));
    dispatch(addNewType(moleculesAction, actionType.INTERACTIONS_TURNED_ON, 'complex', stage, state));
    dispatch(addNewType(moleculesAction, actionType.SURFACE_TURNED_ON, 'surface', stage, state));
    dispatch(addNewType(moleculesAction, actionType.VECTOR_SELECTED, 'vector', stage, state));
  }

  let vectorAction = orderedActionList.find(action => action.action_type === actionType.VECTOR_SELECTED);
  if (vectorAction) {
    dispatch(setCurrentVector(vectorAction.object_name));
  }
};

const restoreCompoundsActions = (orderedActionList, stage) => (dispatch, getState) => {
  const state = getState();

  let compoundsAction = orderedActionList.filter(
    action =>
      action.object_type === actionObjectType.COMPOUND || action.object_type === actionObjectType.CROSS_REFERENCE
  );

  if (compoundsAction) {
    dispatch(addNewTypeCompound(compoundsAction, actionType.LIGAND_TURNED_ON, 'ligand', stage, state));
    dispatch(addNewTypeCompound(compoundsAction, actionType.SIDECHAINS_TURNED_ON, 'protein', stage, state));
    dispatch(addNewTypeCompound(compoundsAction, actionType.INTERACTIONS_TURNED_ON, 'complex', stage, state));
    dispatch(addNewTypeCompound(compoundsAction, actionType.SURFACE_TURNED_ON, 'surface', stage, state));
  }

  let compoundsSelectedAction = compoundsAction.filter(action => action.action_type === actionType.COMPOUND_SELECTED);

  compoundsSelectedAction.forEach(action => {
    let data = getCompound(action, state);
    if (data) {
      dispatch(appendMoleculeToCompoundsOfDatasetToBuy(action.dataset_id, data.id, data.name));
    }
  });
};

const addType = {
  ligand: addLigand,
  protein: addHitProtein,
  complex: addComplex,
  surface: addSurface,
  vector: addVector
};

const addTypeCompound = {
  ligand: addDatasetLigand,
  protein: addDatasetHitProtein,
  complex: addDatasetComplex,
  surface: addDatasetSurface
};

const addNewType = (moleculesAction, actionType, type, stage, state) => dispatch => {
  let actions = moleculesAction.filter(action => action.action_type === actionType);
  if (actions) {
    actions.forEach(action => {
      let data = getMolecule(action.object_name, state);
      if (data) {
        dispatch(addType[type](stage, data, colourList[data.id % colourList.length], true));
      }
    });
  }
};

const addNewTypeOfAction = (action, type, stage, state) => dispatch => {
  if (action) {
    let data = getMolecule(action.object_name, state);
    if (data) {
      if (type === 'ligand') {
        dispatch(addType[type](stage, data, colourList[data.id % colourList.length], true));
      } else {
        dispatch(addType[type](stage, data, colourList[data.id % colourList.length]));
      }
    }
  }
};

const addNewTypeCompound = (moleculesAction, actionType, type, stage, state) => dispatch => {
  let actions = moleculesAction.filter(action => action.action_type === actionType);
  if (actions) {
    actions.forEach(action => {
      let data = getCompound(action, state);
      if (data) {
        dispatch(addTypeCompound[type](stage, data, colourList[data.id % colourList.length], action.dataset_id));
      }
    });
  }
};

const addNewTypeCompoundOfAction = (action, type, stage, state) => dispatch => {
  if (action) {
    let data = getCompound(action, state);
    if (data) {
      dispatch(addTypeCompound[type](stage, data, colourList[data.id % colourList.length], action.dataset_id));
    }
  }
};

const getTarget = (targetName, state) => {
  let targetList = state.apiReducers.target_id_list;
  let target = targetList.find(target => target.title === targetName);
  return target;
};

const getMolGroup = (molGroupName, state) => {
  let molGroupList = state.apiReducers.mol_group_list;
  let molGroup = molGroupList.find(group => group.description === molGroupName);
  return molGroup;
};

const getMolecule = (moleculeName, state) => {
  let moleculeList = state.apiReducers.all_mol_lists;
  let molecule = null;

  if (moleculeList) {
    for (const group in moleculeList) {
      let molecules = moleculeList[group];
      molecule = molecules.find(m => m.protein_code === moleculeName);
      if (molecule && molecule != null) {
        break;
      }
    }
  }
  return molecule;
};

const getCompound = (action, state) => {
  let moleculeList = state.datasetsReducers.moleculeLists;
  let molecule = null;

  let name = action.object_name;
  let datasetID = action.dataset_id;

  if (moleculeList) {
    let moleculeListOfDataset = moleculeList[datasetID];
    molecule = moleculeListOfDataset.find(m => m.name === name);
  }
  return molecule;
};

export const undoAction = (stages = []) => (dispatch, getState) => {
  const state = getState();
  let action = null;

  dispatch(setIsUndoRedoAction(true));

  const actionUndoList = state.undoableTrackingReducers.future;
  let actions = actionUndoList && actionUndoList[0];
  if (actions) {
    let actionsLenght = actions.truck_actions_list.length;
    actionsLenght = actionsLenght > 0 ? actionsLenght - 1 : actionsLenght;
    action = actions.truck_actions_list[actionsLenght];

    Promise.resolve(dispatch(handleUndoAction(action, stages))).then(() => {
      dispatch(setIsUndoRedoAction(false));
    });
  }
};

export const redoAction = (stages = []) => (dispatch, getState) => {
  const state = getState();
  let action = null;

  dispatch(setIsUndoRedoAction(true));

  const actions = state.undoableTrackingReducers.present;
  if (actions) {
    let actionsLenght = actions.truck_actions_list.length;
    actionsLenght = actionsLenght > 0 ? actionsLenght - 1 : actionsLenght;
    action = actions.truck_actions_list[actionsLenght];

    Promise.resolve(dispatch(dispatch(handleRedoAction(action, stages)))).then(() => {
      dispatch(setIsUndoRedoAction(false));
    });
  }
};

const handleUndoAction = (action, stages) => (dispatch, getState) => {
  const state = getState();

  if (action) {
    const majorView = stages.find(view => view.id === VIEWS.MAJOR_VIEW);
    const summaryView = stages.find(view => view.id === VIEWS.SUMMARY_VIEW);
    const stageSummaryView = summaryView.stage;
    const majorViewStage = majorView.stage;

    const type = action.type;
    switch (type) {
      case actionType.ALL_TURNED_ON:
        dispatch(handleAllAction(action, false, majorViewStage, state));
        break;
      case actionType.ALL_TURNED_OFF:
        dispatch(handleAllAction(action, true, majorViewStage, state));
        break;
      case actionType.ALL_TURNED_ON_BY_TYPE:
        dispatch(handleAllActionByType(action, false, majorViewStage));
        break;
      case actionType.ALL_TURNED_OFF_BY_TYPE:
        dispatch(handleAllActionByType(action, true, majorViewStage));
        break;
      case actionType.LIGAND_TURNED_ON:
        dispatch(handleMoleculeAction(action, 'ligand', false, majorViewStage, state));
        break;
      case actionType.SIDECHAINS_TURNED_ON:
        dispatch(handleMoleculeAction(action, 'protein', false, majorViewStage, state));
        break;
      case actionType.INTERACTIONS_TURNED_ON:
        dispatch(handleMoleculeAction(action, 'complex', false, majorViewStage, state));
        break;
      case actionType.SURFACE_TURNED_ON:
        dispatch(handleMoleculeAction(action, 'surface', false, majorViewStage, state));
        break;
      case actionType.VECTORS_TURNED_ON:
        dispatch(handleMoleculeAction(action, 'vector', false, majorViewStage, state));
        break;
      case actionType.LIGAND_TURNED_OFF:
        dispatch(handleMoleculeAction(action, 'ligand', true, majorViewStage, state));
        break;
      case actionType.SIDECHAINS_TURNED_OFF:
        dispatch(handleMoleculeAction(action, 'protein', true, majorViewStage, state));
        break;
      case actionType.INTERACTIONS_TURNED_OFF:
        dispatch(handleMoleculeAction(action, 'complex', true, majorViewStage, state));
        break;
      case actionType.SURFACE_TURNED_OFF:
        dispatch(handleMoleculeAction(action, 'surface', true, majorViewStage, state));
        break;
      case actionType.VECTORS_TURNED_OFF:
        dispatch(handleMoleculeAction(action, 'vector', true, majorViewStage, state));
        break;
      case actionType.VECTOR_SELECTED:
        dispatch(setCurrentVector(undefined));
        break;
      case actionType.VECTOR_DESELECTED:
        dispatch(setCurrentVector(action.object_name));
        break;
      case actionType.TARGET_LOADED:
        dispatch(handleTargetAction(action, false));
        break;
      case actionType.SITE_TURNED_ON:
        dispatch(handleMoleculeGroupAction(action, false, stageSummaryView, majorViewStage));
        break;
      case actionType.SITE_TURNED_OFF:
        dispatch(handleMoleculeGroupAction(action, true, stageSummaryView, majorViewStage));
        break;
      case actionType.MOLECULE_ADDED_TO_SHOPPING_CART:
        dispatch(handleShoppingCartAction(action, false));
        break;
      case actionType.MOLECULE_REMOVED_FROM_SHOPPING_CART:
        dispatch(handleShoppingCartAction(action, true));
        break;
      case actionType.COMPOUND_SELECTED:
        dispatch(handleCompoundAction(action, false));
        break;
      case actionType.COMPOUND_DESELECTED:
        dispatch(handleCompoundAction(action, true));
        break;
      case actionType.REPRESENTATION_CHANGED:
        dispatch(handleChangeRepresentationAction(action, false, majorView));
        break;
      case actionType.REPRESENTATION_ADDED:
        dispatch(handleRepresentationAction(action, false, majorView));
        break;
      case actionType.REPRESENTATION_REMOVED:
        dispatch(handleRepresentationAction(action, true, majorView));
        break;
      default:
        break;
    }
  }
};

const handleRedoAction = (action, stages) => (dispatch, getState) => {
  const state = getState();

  if (action) {
    const majorView = stages.find(view => view.id === VIEWS.MAJOR_VIEW);
    const summaryView = stages.find(view => view.id === VIEWS.SUMMARY_VIEW);
    const stageSummaryView = summaryView.stage;
    const majorViewStage = majorView.stage;

    const type = action.type;
    switch (type) {
      case actionType.ALL_TURNED_ON:
        dispatch(handleAllAction(action, true, majorViewStage, state));
        break;
      case actionType.ALL_TURNED_OFF:
        dispatch(handleAllAction(action, false, majorViewStage, state));
        break;
      case actionType.ALL_TURNED_ON_BY_TYPE:
        dispatch(handleAllActionByType(action, true, majorViewStage));
        break;
      case actionType.ALL_TURNED_OFF_BY_TYPE:
        dispatch(handleAllActionByType(action, false, majorViewStage));
        break;
      case actionType.LIGAND_TURNED_ON:
        dispatch(handleMoleculeAction(action, 'ligand', true, majorViewStage, state));
        break;
      case actionType.SIDECHAINS_TURNED_ON:
        dispatch(handleMoleculeAction(action, 'protein', true, majorViewStage, state));
        break;
      case actionType.INTERACTIONS_TURNED_ON:
        dispatch(handleMoleculeAction(action, 'complex', true, majorViewStage, state));
        break;
      case actionType.SURFACE_TURNED_ON:
        dispatch(handleMoleculeAction(action, 'surface', true, majorViewStage, state));
        break;
      case actionType.VECTORS_TURNED_ON:
        dispatch(handleMoleculeAction(action, 'vector', true, majorViewStage, state));
        break;
      case actionType.LIGAND_TURNED_OFF:
        dispatch(handleMoleculeAction(action, 'ligand', false, majorViewStage, state));
        break;
      case actionType.SIDECHAINS_TURNED_OFF:
        dispatch(handleMoleculeAction(action, 'protein', false, majorViewStage, state));
        break;
      case actionType.INTERACTIONS_TURNED_OFF:
        dispatch(handleMoleculeAction(action, 'complex', false, majorViewStage, state));
        break;
      case actionType.SURFACE_TURNED_OFF:
        dispatch(handleMoleculeAction(action, 'surface', false, majorViewStage, state));
        break;
      case actionType.VECTORS_TURNED_OFF:
        dispatch(handleMoleculeAction(action, 'vector', false, majorViewStage, state));
        break;
      case actionType.VECTOR_SELECTED:
        dispatch(setCurrentVector(action.object_name));
        break;
      case actionType.VECTOR_DESELECTED:
        dispatch(setCurrentVector(undefined));
        break;
      case actionType.TARGET_LOADED:
        dispatch(handleTargetAction(action, true));
        break;
      case actionType.SITE_TURNED_ON:
        dispatch(handleMoleculeGroupAction(action, true, stageSummaryView, majorViewStage));
        break;
      case actionType.SITE_TURNED_OFF:
        dispatch(handleMoleculeGroupAction(action, false, stageSummaryView, majorViewStage));
        break;
      case actionType.MOLECULE_ADDED_TO_SHOPPING_CART:
        dispatch(handleShoppingCartAction(action, true));
        break;
      case actionType.MOLECULE_REMOVED_FROM_SHOPPING_CART:
        dispatch(handleShoppingCartAction(action, false));
        break;
      case actionType.COMPOUND_SELECTED:
        dispatch(handleCompoundAction(action, true));
        break;
      case actionType.COMPOUND_DESELECTED:
        dispatch(handleCompoundAction(action, false));
        break;
      case actionType.REPRESENTATION_CHANGED:
        dispatch(handleChangeRepresentationAction(action, true, majorView));
        break;
      case actionType.REPRESENTATION_ADDED:
        dispatch(handleRepresentationAction(action, true, majorView));
        break;
      case actionType.REPRESENTATION_REMOVED:
        dispatch(handleRepresentationAction(action, false, majorView));
        break;
      default:
        break;
    }
  }
};

const handleAllActionByType = (action, isAdd, stage) => (dispatch, getState) => {
  let actionItems = action.items;
  let type = action.control_type;
  if (action.object_type === actionObjectType.MOLECULE || action.object_type === actionObjectType.INSPIRATION) {
    if (isAdd) {
      actionItems.forEach(data => {
        if (data) {
          if (type === 'ligand') {
            dispatch(addType[type](stage, data, colourList[data.id % colourList.length], true));
          } else {
            dispatch(addType[type](stage, data, colourList[data.id % colourList.length]));
          }
        }
      });
    } else {
      actionItems.forEach(data => {
        if (data) {
          dispatch(removeType[type](stage, data, colourList[data.id % colourList.length]));
        }
      });
    }
  } else if (
    action.object_type === actionObjectType.COMPOUND ||
    action.object_type === actionObjectType.CROSS_REFERENCE
  ) {
    if (isAdd) {
      actionItems.forEach(data => {
        if (data && data.molecule) {
          dispatch(
            addTypeCompound[type](stage, data.molecule, colourList[data.id % colourList.length], data.datasetID)
          );
        }
      });
    } else {
      actionItems.forEach(data => {
        if (data && data.molecule) {
          dispatch(
            removeTypeCompound[type](stage, data.molecule, colourList[data.id % colourList.length], data.datasetID)
          );
        }
      });
    }
  }
};

const handleAllAction = (action, isSelected, majorViewStage, state) => (dispatch, getState) => {
  if (action.isLigand) {
    dispatch(handleMoleculeAction(action, 'ligand', isSelected, majorViewStage, state));
  }

  if (action.isProtein) {
    dispatch(handleMoleculeAction(action, 'protein', isSelected, majorViewStage, state));
  }

  if (action.isComplex) {
    dispatch(handleMoleculeAction(action, 'complex', isSelected, majorViewStage, state));
  }
};

const handleTargetAction = (action, isSelected, stages) => (dispatch, getState) => {
  const state = getState();
  if (action) {
    if (isSelected === false) {
      dispatch(setTargetOn(undefined));
    } else {
      let target = getTarget(action.object_name, state);
      if (target) {
        dispatch(setTargetOn(target.id));
        dispatch(shouldLoadProtein({ nglViewList: stages, currentSnapshotID: null, isLoadingCurrentSnapshot: false }));
      }
    }
  }
};

const handleCompoundAction = (action, isSelected) => (dispatch, getState) => {
  const state = getState();
  if (action) {
    let data = getCompound(action, state);
    if (data) {
      if (isSelected === true) {
        dispatch(appendMoleculeToCompoundsOfDatasetToBuy(action.dataset_id, data.id, data.name));
      } else {
        dispatch(removeMoleculeFromCompoundsOfDatasetToBuy(action.dataset_id, data.id, data.name));
      }
    }
  }
};

const handleShoppingCartAction = (action, isAdd) => (dispatch, getState) => {
  if (action) {
    let data = action.item;
    if (isAdd) {
      dispatch(appendToBuyList(data));
    } else {
      dispatch(removeFromToBuyList(data));
    }
  }
};

const handleRepresentationAction = (action, isAdd, nglView) => (dispatch, getState) => {
  if (action) {
    if (isAdd === true) {
      dispatch(addRepresentation(action.object_id, action.representation, nglView));
    } else {
      dispatch(removeRepresentation(action.object_id, action.representation, nglView));
    }
  }
};

const addRepresentation = (parentKey, representation, nglView) => (dispatch, getState) => {
  const oldRepresentation = representation;
  const newRepresentationType = oldRepresentation.type;
  const comp = nglView.stage.getComponentsByName(parentKey).first;
  const newRepresentation = assignRepresentationToComp(
    newRepresentationType,
    oldRepresentation.params,
    comp,
    oldRepresentation.lastKnownID
  );
  dispatch(addComponentRepresentation(parentKey, newRepresentation));
};

const handleChangeRepresentationAction = (action, isAdd, nglView) => (dispatch, getState) => {
  if (action) {
    dispatch(changeRepresentation(isAdd, action.change, action.object_id, action.representation, nglView));
  }
};

const changeRepresentation = (isAdd, change, parentKey, representation, nglView) => (dispatch, getState) => {
  const comp = nglView.stage.getComponentsByName(parentKey).first;
  const r = comp.reprList.find(rep => rep.uuid === representation.uuid || rep.uuid === representation.lastKnownID);
  if (r && change) {
    let key = change.key;
    let value = isAdd ? change.value : change.oldValue;

    r.setParameters({ [key]: value });
    representation.params[key] = value;

    dispatch(updateComponentRepresentation(parentKey, representation.uuid, representation));
  }
};

const removeRepresentation = (parentKey, representation, nglView) => (dispatch, getState) => {
  const comp = nglView.stage.getComponentsByName(parentKey).first;
  let foundedRepresentation = undefined;
  comp.eachRepresentation(r => {
    if (r.uuid === representation.uuid || r.uuid === representation.lastKnownID) {
      foundedRepresentation = r;
    }
  });
  if (foundedRepresentation) {
    comp.removeRepresentation(foundedRepresentation);

    if (comp.reprList.length === 0) {
      dispatch(deleteObject(nglView, nglView.stage, true));
    } else {
      dispatch(removeComponentRepresentation(parentKey, representation));
    }
  }
};

const handleMoleculeGroupAction = (action, isSelected, stageSummaryView, majorViewStage) => (dispatch, getState) => {
  const state = getState();
  if (action) {
    let moleculeGroup = getMolGroup(action.object_name, state);
    if (moleculeGroup) {
      if (isSelected === true) {
        dispatch(selectMoleculeGroup(moleculeGroup, stageSummaryView));
      } else {
        dispatch(onDeselectMoleculeGroup({ moleculeGroup, stageSummaryView, majorViewStage }));
      }
    }
  }
};

const handleMoleculeAction = (action, type, isAdd, stage, state) => (dispatch, getState) => {
  if (action.object_type === actionObjectType.MOLECULE || action.object_type === actionObjectType.INSPIRATION) {
    if (isAdd) {
      dispatch(addNewTypeOfAction(action, type, stage, state));
    } else {
      dispatch(removeNewType(action, type, stage, state));
    }
  } else if (
    action.object_type === actionObjectType.COMPOUND ||
    action.object_type === actionObjectType.CROSS_REFERENCE
  ) {
    if (isAdd) {
      dispatch(addNewTypeCompoundOfAction(action, type, stage, state));
    } else {
      dispatch(removeNewTypeCompound(action, type, stage, state));
    }
  }
};

const removeType = {
  ligand: removeLigand,
  protein: removeHitProtein,
  complex: removeComplex,
  surface: removeSurface,
  vector: removeVector
};

const removeTypeCompound = {
  ligand: removeDatasetLigand,
  protein: removeDatasetHitProtein,
  complex: removeDatasetComplex,
  surface: removeDatasetSurface
};

const removeNewType = (action, type, stage, state) => dispatch => {
  if (action) {
    let data = getMolecule(action.object_name, state);
    if (data) {
      dispatch(removeType[type](stage, data, colourList[data.id % colourList.length]));
    }
  }
};

const removeNewTypeCompound = (action, type, stage, state) => dispatch => {
  if (action) {
    let data = getCompound(action, state);
    if (data) {
      dispatch(removeTypeCompound[type](stage, data, colourList[data.id % colourList.length], action.dataset_id));
    }
  }
};

export const getCanUndo = () => (dispatch, getState) => {
  const state = getState();
  return state.undoableTrackingReducers.past.length > 0;
};

export const getCanRedo = () => (dispatch, getState) => {
  const state = getState();
  return state.undoableTrackingReducers.future.length > 0;
};

export const appendAndSendTruckingActions = truckAction => (dispatch, getState) => {
  const state = getState();
  const currentProject = state.projectReducers.currentProject;
  const sendActions = state.trackingReducers.send_actions_list;

  Promise.resolve(dispatch(checkActionsProject(sendActions, currentProject))).then(response => {
    if (truckAction) {
      dispatch(appendToActionList(truckAction));
      dispatch(appendToSendActionList(truckAction));
    }
    if (response === true) {
      dispatch(checkSendTruckingActions());
    }
  });
};

export const checkSendTruckingActions = () => (dispatch, getState) => {
  const state = getState();
  const currentProject = state.projectReducers.currentProject;
  const sendActions = state.trackingReducers.send_actions_list;
  const length = sendActions.length;

  if (length >= CONSTANTS.COUNT_SEND_TRUCK_ACTIONS) {
    dispatch(sendTruckingActions(sendActions, currentProject));
  }
};

const sendTruckingActions = (sendActions, project) => (dispatch, getState) => {
  if (project) {
    const projectID = project && project.projectID;

    if (projectID && sendActions && sendActions.length > 0) {
      dispatch(setIsActionsSending(true));

      const dataToSend = {
        session_project: projectID,
        author: project.authorID,
        last_update_date: moment().format(),
        actions: JSON.stringify(sendActions)
      };
      return api({
        url: `${base_url}/api/session-actions/`,
        method: METHOD.POST,
        data: JSON.stringify(dataToSend)
      })
        .then(() => {
          dispatch(setSendActionsList([]));
        })
        .catch(error => {
          throw new Error(error);
        })
        .finally(() => {
          dispatch(setIsActionsSending(false));
        });
    } else {
      return Promise.resolve();
    }
  } else {
    return Promise.resolve();
  }
};

export const setProjectTruckingActions = () => (dispatch, getState) => {
  const state = getState();
  const currentProject = state.projectReducers.currentProject;
  const projectID = currentProject && currentProject.projectID;

  dispatch(getTruckingActions(projectID));
};

const getTruckingActions = projectID => (dispatch, getState) => {
  const state = getState();
  const sendActions = state.trackingReducers.send_actions_list;

  if (projectID) {
    dispatch(setIsActionsLoading(true));
    return api({
      url: `${base_url}/api/session-actions/?session_project=${projectID}`
    })
      .then(response => {
        let results = response.data.results;
        let listToSet = [];
        results.forEach(r => {
          let resultActions = JSON.parse(r.actions);
          listToSet.push(...resultActions);
        });

        let projectActions = [...listToSet, ...sendActions];
        dispatch(setProjectActionList(projectActions));
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        dispatch(setIsActionsLoading(false));
      });
  } else {
    let projectActions = [...sendActions];
    dispatch(setProjectActionList(projectActions));
    return Promise.resolve();
  }
};

const checkActionsProject = (actions, currentProject) => (dispatch, getState) => {
  const state = getState();
  const currentProjectID = currentProject && currentProject.projectID;
  const actionList = state.trackingReducers.truck_actions_list;

  let project = dispatch(getActionProject(actionList, currentProjectID));
  if (project !== null) {
    dispatch(sendTruckingActions(actions, project));

    let newProject = { projectID: currentProject.projectID, authorID: currentProject.authorID };
    let newActionsList = [];

    actionList.forEach(r => {
      newActionsList.push(Object.assign({ ...r, project: newProject }));
    });

    dispatch(setActionsList(newActionsList));
    dispatch(sendTruckingActions(newActionsList, currentProject));
    return Promise.resolve(false);
  } else {
    return Promise.resolve(true);
  }
};

const getActionProject = (actions, currentProjectID) => (dispatch, getState) => {
  let action = actions && actions.slice(-1).pop();
  let project = null;
  if (action && action.project.projectID !== currentProjectID) {
    project = action.project;
  }
  return project;
};

export const sendTruckingActionsByProjectId = (projectID, authorID) => (dispatch, getState) => {
  const state = getState();
  const actionList = state.trackingReducers.truck_actions_list;
  const project = { projectID, authorID };

  let newActionsList = [];

  actionList.forEach(r => {
    newActionsList.push(Object.assign({ ...r, project: project }));
  });

  dispatch(sendTruckingActions(newActionsList, project));
};
