import React from 'react';
import { app, getCurrentWindow } from '@electron/remote';
import { exec } from 'child_process';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { Settings } from '@mui/icons-material';

/**
 * AppBar Settings Menu Button Component
 */
export default function () {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const onDevToolsClick = () => {
    const window = getCurrentWindow();
    window.webContents.openDevTools();
    setAnchorEl(null);
  };

  const onUserDataClick = () => {
    /**
     * https://stackoverflow.com/a/68010888
     */
    let command = '';
    switch (process.platform) {
      case 'darwin':
        command = 'open';
        break;
      case 'win32':
        command = 'explorer';
        break;
      default:
        command = 'xdg-open';
        break;
    }
    exec(`${command} "${app.getPath('userData')}"`);
    setAnchorEl(null);
  };

  const onClose = () => setAnchorEl(null);

  const onOpen = (event) => setAnchorEl(event.currentTarget);

  return (
    <>
      <Tooltip title="Settings">
        <IconButton onClick={onOpen} sx={{ marginX: 2 }}>
          <Settings />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
        <MenuItem onClick={onDevToolsClick}>
          {'Open dev tools'}
        </MenuItem>
        <MenuItem onClick={onUserDataClick}>
          {'Open data directory'}
        </MenuItem>
      </Menu>
    </>
  );
}
