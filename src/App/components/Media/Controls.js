import React from 'react';
import { useSelector } from 'react-redux';
import {
  AppBar, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar,
} from '@mui/material';
import {
  KeyboardArrowLeft, KeyboardArrowRight, MenuOpen,
} from '@mui/icons-material';
import { useFileNavigation, useMediaFileIndex } from '../../shared/hooks';

/**
 * Media Controls Component
 */
export default function ({ menuItems }) {
  const files = useSelector((state) => state.files);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [onPreviousFile, onNextFile] = useFileNavigation();
  const mediaFileIndex = useMediaFileIndex();

  const isMediaFirstFile = React.useMemo(() => (
    mediaFileIndex <= 0
  ), [mediaFileIndex]);

  const isMediaLastFile = React.useMemo(() => (
    mediaFileIndex >= files.length - 1
  ), [files, mediaFileIndex]);

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

  return (
    <AppBar color="transparent" elevation={0} position="relative">
      <Toolbar variant="dense">
        <Grid container justifyContent="center">
          <IconButton disabled={isMediaFirstFile} onClick={onPreviousFile}>
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton onClick={onMenuOpen}>
            <MenuOpen />
          </IconButton>
          <IconButton disabled={isMediaLastFile} onClick={onNextFile}>
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
