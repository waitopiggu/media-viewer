import React from 'react';
import {
  AppBar, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar,
} from '@mui/material';
import {
  KeyboardArrowLeft, KeyboardArrowRight, MenuOpen,
} from '@mui/icons-material';
import { useFileNavigation } from '../../shared/hooks';

/**
 * Media Controls Component
 */
export default function ({ menuItems }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [onPreviousFile, onNextFile] = useFileNavigation();

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
