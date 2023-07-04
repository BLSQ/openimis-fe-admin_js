import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { historyPush, withModulesManager, withHistory, withTooltip, formatMessage } from "@openimis/fe-core";
// import HeraOverview from "../components/HeraOverview";
import { RIGHT_USER_ADD } from "../constants";

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import DialogContentText from '@material-ui/core/DialogContentText';
import {useUpdateHeraSubsMutation, useQueryHeraSubs, Overview} from "../components/HeraOverview";
import { Select, MenuItem } from '@material-ui/core';

const dialogStyles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(dialogStyles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

function FormDialog(props) {
  const { open, handleClose } = props;
  const { mutate } = useUpdateHeraSubsMutation();
  const [mutationError, setMutationError] = useState(null);
  const [topic, setTopic] = useState('');

  const handleMutation = async() => {
    try {
      await mutate({topic, operation: "subscribe_to_life_event"});
      handleClose();
      window.location.reload(false);
    } catch (error) {
      setMutationError(error.message);
      console.error(error); // handle the error as needed
    }
  };


  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe to a Hera Topic</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {mutationError
            ? <h5 style={{color: "red"}}>{mutationError}</h5>
            : <p>To subscribe to hera topic, please write the topic name.</p>
          }
          </DialogContentText>
          <Select
            autoFocus
            value={topic}
            onChange={(event)=>setTopic(event.target.value)}
            displayEmpty
            id="name"
            label="Topic"
            fullWidth
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value={'LifeEventTopic'}>LifeEventTopic</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleMutation} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const styles = (theme) => ({
  page: theme.page,
  fab: theme.fab,
});

class UsersPage extends Component {
  state = {
    open: false,
  };

  onDoubleClick = (u, newTab = false) => {
    historyPush(this.props.modulesManager, this.props.history, "admin.hera", [u.id], newTab);
  };

  onAdd = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, rights, intl } = this.props;
    const { open } = this.state;
    return (
      <div className={classes.page}>
        <Overview cacheFiltersKey="usersPageFiltersCache" onDoubleClick={this.onDoubleClick} />
        {rights.includes(RIGHT_USER_ADD) &&
          <div className={classes.fab}>
            <Fab color="primary" onClick={this.onAdd}>
              <AddIcon />
            </Fab>
          </div>
        }
        <FormDialog open={open} handleClose={this.handleClose} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  rights: state.core?.user?.i_user?.rights ?? [],
});

export default injectIntl(
  withModulesManager(withHistory(connect(mapStateToProps)(withTheme(withStyles(styles)(UsersPage))))),
);
