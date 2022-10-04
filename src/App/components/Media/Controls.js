import React from 'react';
import { useDispatch } from 'react-redux';
import {
  AppBar,
  Divider,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Popover,
  Toolbar,
  Tooltip,
} from '@mui/material';
import {
  KeyboardArrowLeft, KeyboardArrowRight, Settings,
} from '@mui/icons-material';
import actions from '../../store/actions';

/**
 * Media Controls Component
 */
export default function ({ menuItems }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();

  const makeMenuItemClick = (onClick) => () => {
    onClick && onClick();
    setAnchorEl(null);
  };

  const mapMenuItem = ({ Icon, label, onClick, subheader }, index) => (
    subheader ? (
      <React.Fragment key={index}>
        <ListSubheader>{subheader}</ListSubheader>
        <Divider />
      </React.Fragment>
    ) : (
      <ListItemButton key={index} onClick={makeMenuItemClick(onClick)}>
        <ListItemIcon><Icon fontSize="small" /></ListItemIcon>
        <ListItemText>{label}</ListItemText>
      </ListItemButton>
    )
  );

  const onMenuClose = () => setAnchorEl(null);
  const onMenuOpen = (event) => setAnchorEl(event.currentTarget);

  const onNextFile = () => dispatch(actions.directoryFile.navigate(1));
  const onPreviousFile = () => dispatch(actions.directoryFile.navigate(-1));

  return (
    <AppBar color="transparent" elevation={0} position="relative">
      <Divider />
      <Toolbar variant="dense">
        <Grid container justifyContent="center">
          <Tooltip title="Previous File">
            <IconButton color="primary" onClick={onPreviousFile}>
              <KeyboardArrowLeft />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton color="primary" onClick={onMenuOpen}>
              <Settings />
            </IconButton>
          </Tooltip>
          <Tooltip title="Next File">
            <IconButton color="primary" onClick={onNextFile}>
              <KeyboardArrowRight />
            </IconButton>
          </Tooltip>
        </Grid>
      </Toolbar>
      <Popover anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onMenuClose}>
        <List>{menuItems.map(mapMenuItem)}</List>
      </Popover>
    </AppBar>
  );
}
