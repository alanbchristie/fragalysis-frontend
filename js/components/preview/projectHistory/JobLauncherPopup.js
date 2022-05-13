import React, { useState } from 'react';
import { Box, ClickAwayListener, IconButton, MenuItem, Popper, Tooltip, Typography, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { Button } from '../../common/Inputs/Button';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import HelpIcon from '@material-ui/icons/Help';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  setJobLauncherPopUpAnchorEl,
  setJobFragmentProteinSelectWindowAnchorEl,
  setJobLauncherData
} from '../../projects/redux/actions';
import { jobFileTransfer } from '../../projects/redux/dispatchActions';

const useStyles = makeStyles(theme => ({
  jobLauncherPopup: {
    width: '750px',
    borderRadius: '5px',
    border: '1px solid #000',
    display: 'flex',
    flexDirection: 'column'
  },

  topPopup: {
    width: '100%',
    borderRadius: '5px 5px 0 0',
    backgroundColor: '#3f51b5',
    color: '#fff',
    paddingLeft: '10px',
    lineHeight: '30px'
  },

  popUpButton: {
    borderRadius: '0 5px 0 0',
    backgroundColor: '#d33f3f',
    color: '#fff',
    padding: '5px 10px 5px 10px',
    border: 'none',
    float: 'right',
    height: '30px',
    '&:hover': {
      borderRadius: '0 5px 0 0',
      backgroundColor: '#aa3939',
      color: '#fff',
      cursor: 'pointer'
    }
  },

  bodyPopup: {
    padding: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '0 0 5px 5px'
  },

  sideBody: {
    width: '50%',
    padding: '5px'
  },

  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'start'
  },

  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },

  marginTop5: {
    marginTop: '5px'
  },

  fontWeightBold: {
    fontWeight: 'bold'
  },

  marginLeft10: {
    marginLeft: '10px'
  },

  width70: {
    width: '70%'
  },

  width30: {
    width: '30%'
  },

  width60: {
    width: '60%'
  },

  floatLeft: {
    float: 'left'
  },

  floatRight: {
    float: 'right'
  },

  radioPlusDropdown: {
    width: '30%',
    marginTop: '20px'
  },

  typographyH: {
    marginTop: '10px',
    fontWeight: 'bold'
  },

  successMsg: {
    padding: '10px',
    background: '#66BB6A',
    color: '#ffffff',
    fontWeight: 'bold'
  },

  errorMsg: {
    padding: '10px',
    background: 'red',
    color: '#ffffff',
    fontWeight: 'bold'
  }
}));

const JobLauncherPopup = ({ jobLauncherPopUpAnchorEl, snapshots }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const handleTooltipClose = () => {
    setOpen(false);
  };
  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const getAllMolecules = useSelector(state => state.apiReducers.all_mol_lists);

  const currentSnapshotID = useSelector(state => state.projectReducers.currentSnapshot.id);
  const targetId = useSelector(state => state.apiReducers.target_on);

  // get ids of selected/visible compounds
  const currentSnapshotSelectedCompoundsIDs = useSelector(state => state.selectionReducers.moleculesToEdit);
  const currentSnapshotVisibleCompoundsIDs = useSelector(state => state.selectionReducers.fragmentDisplayList);

  const target_on_name = useSelector(state => state.apiReducers.target_on_name);

  const getMoleculeEnumName = title => {
    let newTitle = title.replace(new RegExp(`${target_on_name}-`, 'i'), '');
    newTitle = newTitle.replace(new RegExp(':.*$', 'i'), '');

    return newTitle;
  };

  const getFragmentTemplate = fragment => {
    return `fragalysis-files/${target_on_name}/${fragment}.mol`;
  };

  const getProteinTemplate = protein => {
    return `fragalysis-files/${target_on_name}/${protein}_apo-desolv.pdb`;
  };

  const getMoleculeTitle = title => {
    return title.replace(new RegExp(':.*$', 'i'), '');
  };

  // get protein_code from ids of selected/visible compounds
  const currentSnapshotSelectedCompounds = getAllMolecules
    .filter(molecule => currentSnapshotSelectedCompoundsIDs.includes(molecule.id))
    .map(molecule => getMoleculeTitle(molecule.protein_code));
  const currentSnapshotVisibleCompounds = getAllMolecules
    .filter(molecule => currentSnapshotVisibleCompoundsIDs.includes(molecule.id))
    .map(molecule => getMoleculeTitle(molecule.protein_code));

  const jobList = useSelector(state => state.projectReducers.jobList);

  const onSubmitForm = ({ job, compounds, snapshot }) => {
    let chosenCompounds = null;
    if (compounds === 'snapshot') {
      chosenCompounds = [
        'Compound from snapshot' // TODO
      ];
    } else if (compounds === 'selected-compounds') {
      chosenCompounds = currentSnapshotSelectedCompounds;
    } else if (compounds === 'visible-compounds') {
      chosenCompounds = currentSnapshotVisibleCompounds;
    }

    // Close the actual pop up window
    dispatch(setJobLauncherPopUpAnchorEl(null));

    const getFilteredJob = job => {
      return jobList.find(jobFiltered => job === jobFiltered.id);
    };

    // Set options for second window
    dispatch(
      setJobLauncherData({
        job: getFilteredJob(job),
        // Prepares data for expanding, see comments in JobFragmentProteinSelectWindow
        data: {
          'lhs-fragments': {
            enum: chosenCompounds.map(fragment => getFragmentTemplate(fragment)),
            enumNames: chosenCompounds.map(compound => getMoleculeEnumName(compound))
          },
          'lhs-protein-apo-desolv': {
            enum: chosenCompounds.map(protein => getProteinTemplate(protein)),
            enumNames: chosenCompounds.map(compound => getMoleculeEnumName(compound))
          }
        }
      })
    );

    jobFileTransfer({
      snapshot: currentSnapshotID,
      target: targetId,
      // squonk_project: dispatch(getSquonkProject()),
      squonk_project: 'project-e1ce441e-c4d1-4ad1-9057-1a11dbdccebe',
      proteins: chosenCompounds.join()
    })
      .then(resp => {
        // Open second window
        setErrorMsg(null);
        setIsError(false);
        dispatch(setJobFragmentProteinSelectWindowAnchorEl(true));
      })
      .catch(err => {
        console.log(`Job file transfer failed: ${err}`);
        setErrorMsg(err.response.data);
        setIsError(true);
      });
  };

  return (
    <Popper
      open={!!jobLauncherPopUpAnchorEl}
      onClose={() => {
        setErrorMsg(null);
        setIsError(false);
        dispatch(setJobLauncherPopUpAnchorEl(null));
      }}
      anchorEl={jobLauncherPopUpAnchorEl}
      placement="left"
    >
      <div className={classes.jobLauncherPopup}>
        <div className={classes.topPopup}>
          <span>Job launcher</span>
          <button
            className={classes.popUpButton}
            onClick={() => {
              setErrorMsg(null);
              setIsError(false);
              dispatch(setJobLauncherPopUpAnchorEl(null));
            }}
          >
            X
          </button>
        </div>
        <div className={classes.bodyPopup}>
          <Formik initialValues={{ compounds: 'snapshot', snapshot: '', job: '' }} onSubmit={onSubmitForm}>
            {({ values, submitForm, isSubmitting }) => (
              <Form className={classes.flexRow}>
                <div className={classes.sideBody}>
                  <Field
                    component={TextField}
                    type="text"
                    name="job"
                    select
                    variant="standard"
                    margin="none"
                    label="Fragment network merges"
                    InputLabelProps={{ shrink: true }}
                    className={classes.width70}
                    disabled={false}
                  >
                    {Object.values(jobList).map(item => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Field>
                  <ClickAwayListener onClickAway={handleTooltipClose}>
                    <Tooltip
                      PopperProps={{
                        disablePortal: true
                      }}
                      onClose={handleTooltipClose}
                      open={open}
                      disableFocusListener
                      disableHoverListener
                      disableTouchListener
                      title="Morbi ac enim quis magna lobortis pulvinar non id enim."
                    >
                      <IconButton aria-label="Help" size="medium" color="default" onClick={handleTooltipOpen}>
                        <HelpIcon />
                      </IconButton>
                    </Tooltip>
                  </ClickAwayListener>
                  <Typography className={classes.typographyH}>Description</Typography>
                  <Typography align="justify" className={classes.marginTop5}>
                    {jobList.filter(jobType => jobType['id'] === values.job).map(jobType => jobType['description'])}
                  </Typography>
                </div>
                <div className={classes.sideBody}>
                  <Typography className={classes.fontWeightBold}>Compounds:</Typography>
                  <Box className={classes.flexColumn}>
                    <div className={classes.flexRow}>
                      <div className={classes.radioPlusDropdown}>
                        <Field type="radio" name="compounds" value="snapshot" />
                        Snapshot
                      </div>

                      <Field
                        component={TextField}
                        type="text"
                        name="snapshot"
                        select
                        variant="standard"
                        margin="none"
                        InputLabelProps={{ shrink: true }}
                        className={(classes.marginLeft10, classes.width60)}
                        label="Choose the snapshot"
                        disabled={values.compounds !== 'snapshot'}
                      >
                        {Object.values(snapshots).map(item => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.title}
                          </MenuItem>
                        ))}
                      </Field>
                    </div>
                    <div>
                      <Field type="radio" name="compounds" value="selected-compounds" />
                      Selected compounds
                    </div>
                    <div>
                      <Field type="radio" name="compounds" value="visible-compounds" />
                      Visible compounds
                    </div>
                  </Box>
                  {isError && (
                    <Paper variant="elevation" rounded="true" className={classes.errorMsg}>
                      {errorMsg}
                    </Paper>
                  )}
                  <Button color="primary" size="large" onClick={submitForm}>
                    Launch
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Popper>
  );
};

export default JobLauncherPopup;
