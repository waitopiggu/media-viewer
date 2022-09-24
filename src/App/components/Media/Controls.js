import React from 'react';
import { useDispatch } from 'react-redux';
import {
  AppBar, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar,
} from '@mui/material';
import {
  KeyboardArrowLeft, KeyboardArrowRight, MenuOpen,
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

  const mapMenuItem = ({ Icon, label, onClick }, index) => (
    <MenuItem key={index} onClick={makeMenuItemClick(onClick)}>
      <ListItemIcon><Icon fontSize="small" /></ListItemIcon>
      <ListItemText>{label}</ListItemText>
    </MenuItem>
  );

  const onMenuClose = () => setAnchorEl(null);

  const onMenuOpen = (event) => setAnchorEl(event.currentTarget);

  const onNextFile = () => dispatch(actions.media.navigate(1));

  const onPreviousFile = () => dispatch(actions.media.navigate(-1));

  return (
    <AppBar color="transparent" elevation={0} position="relative">
      <Toolbar variant="dense">
        <Grid container justifyContent="center">
          <IconButton onClick={onPreviousFile}>
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton onClick={onMenuOpen}>
            <MenuOpen />
          </IconButton>
          <IconButton onClick={onNextFile}>
            <KeyboardArrowRight />
          </IconButton>
        </Grid>
      </Toolbar>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onMenuClose}>
        {menuItems.map(mapMenuItem)}
      </Menu>
    </AppBar>
  );
}
