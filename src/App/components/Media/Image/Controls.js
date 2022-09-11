import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Grid, IconButton, Menu, MenuItem, Toolbar } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight, MenuOpen } from '@mui/icons-material';
import { useFileNavigation } from '../../../shared/hooks';
import { actions } from '../../../store';

const menuItems = [
  { action: { fit: 'none' }, label: 'Fit None' },
  { action: { fit: 'contain' }, label: 'Fit Contain' },
  { action: { fit: 'width' }, label: 'Fit Width' },
];

/**
 * Image Controls Component
 */
export default () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const image = useSelector((state) => state.image);
  const [onPreviousFile, onNextFile] = useFileNavigation();

  const makeMenuClick = (action) => () => {
    dispatch(actions.image.merge(action));
    setAnchorEl(null);
  };

  const onMenuClose = () => setAnchorEl(null);

  const onMenuOpen = (event) => setAnchorEl(event.currentTarget);

  return (
    <AppBar color='transparent' position="relative">
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
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onMenuClose}
      >
        {menuItems.map(({ action, label }, index) => (
          <MenuItem key={index} onClick={makeMenuClick(action)}>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
};
