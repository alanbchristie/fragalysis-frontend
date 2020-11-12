/**
 * Created by ricgillams on 28/06/2018.
 */

import React, { memo, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '../../common/Inputs/Button';
import { Settings, Mouse, PersonalVideo, Undo, Redo } from '@material-ui/icons';
import { ButtonGroup, Grid, makeStyles, Tooltip } from '@material-ui/core';
import { SettingControls } from './settingsControls';
import DisplayControls from './displayControls/';
import { MouseControls } from './mouseControls';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import { undoAction, redoAction, getCanRedo, getCanUndo } from '../../../../js/reducers/tracking/dispatchActions';
import { NglContext } from '../../nglView/nglProvider';

const drawers = {
  settings: 'settings',
  display: 'display',
  mouse: 'mouse'
};

const initDrawers = { [drawers.settings]: false, [drawers.display]: false, [drawers.mouse]: false };

const useStyles = makeStyles(theme => ({
  button: {
    padding: theme.spacing(1)
  }
}));

export const ViewerControls = memo(({}) => {
  const [drawerSettings, setDrawerSettings] = useState(JSON.parse(JSON.stringify(initDrawers)));
  const classes = useStyles();
  const dispatch = useDispatch();
  const { nglViewList } = useContext(NglContext);
  const [canUndo, setCanUndo] = useState(true);
  const [canRedo, setCanRedo] = useState(false);

  const openDrawer = key => {
    //close all and open selected by key
    let newDrawerState = JSON.parse(JSON.stringify(initDrawers));
    newDrawerState[key] = !drawerSettings[key];
    setDrawerSettings(newDrawerState);
  };
  const closeAllDrawers = () => {
    setDrawerSettings(JSON.parse(JSON.stringify(initDrawers)));
  };

  return (
    <>
      <Grid container justify="center">
        <Grid item>
          <ButtonGroup variant="contained" color="primary">
            <Tooltip title="Undo">
              <Button
                size="small"
                color="primary"
                onClick={() => {
                  dispatch(UndoActionCreators.undo());
                  setCanRedo(dispatch(getCanRedo()));
                  setCanUndo(dispatch(getCanUndo()));
                  dispatch(undoAction(nglViewList));
                }}
                className={classes.button}
                disabled={!canUndo}
              >
                <Undo />
              </Button>
            </Tooltip>
            <Tooltip title="Settings controls">
              <Button
                size="small"
                color="primary"
                onClick={() => openDrawer(drawers.settings)}
                className={classes.button}
              >
                <Settings />
              </Button>
            </Tooltip>
            <Tooltip title="Display controls">
              <Button
                size="small"
                color="primary"
                onClick={() => openDrawer(drawers.display)}
                className={classes.button}
              >
                <PersonalVideo />
              </Button>
            </Tooltip>
            <Tooltip title="Mouse controls">
              <Button size="small" color="primary" onClick={() => openDrawer(drawers.mouse)} className={classes.button}>
                <Mouse />
              </Button>
            </Tooltip>
            <Tooltip title="Redo">
              <Button
                size="small"
                color="primary"
                onClick={() => {
                  dispatch(UndoActionCreators.redo());
                  setCanRedo(dispatch(getCanRedo()));
                  setCanUndo(dispatch(getCanUndo()));
                  dispatch(redoAction(nglViewList));
                }}
                className={classes.button}
                disabled={!canRedo}
              >
                <Redo />
              </Button>
            </Tooltip>
          </ButtonGroup>
        </Grid>
      </Grid>
      <SettingControls open={drawerSettings[drawers.settings]} onClose={closeAllDrawers} />
      <DisplayControls open={drawerSettings[drawers.display]} onClose={closeAllDrawers} />
      <MouseControls open={drawerSettings[drawers.mouse]} onClose={closeAllDrawers} />
    </>
  );
});
