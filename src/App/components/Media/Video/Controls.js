import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Grid, IconButton, Menu, MenuItem, Toolbar } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight, MenuOpen } from '@mui/icons-material';
import { useFileNavigation } from '../../../shared/hooks';
import { actions } from '../../../store';

/**
 * Video Controls Component
 */
export default ({ onVideoStateChanging }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const [onPreviousFile, onNextFile] = useFileNavigation();
  const video = useSelector((state) => state.video);

  const menuItems = React.useMemo(() => [
    { action: { autoplay: !video.autoplay }, label: 'Autoplay'},
    { action: { loop: !video.loop }, label: 'Loop'},
  ], [video]);

  const makeMenuClick = (action) => () => {
    onVideoStateChanging();
    dispatch(actions.video.merge(action));
    setAnchorEl(null);
  };

  const mapMenuItem = ({ action, label }, index) => (
    <MenuItem key={index} onClick={makeMenuClick(action)}>
      {label}
    </MenuItem>
  );

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
        {menuItems.map(mapMenuItem)}
      </Menu>
    </AppBar>
  );
};
