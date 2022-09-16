import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { existsSync, statSync } from 'fs';
import {
  AppBar, Avatar, IconButton, InputBase, Menu, MenuItem, Toolbar, Typography,
} from '@mui/material';
import { FolderOpen, SaveOutlined, SaveAsOutlined } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { util } from '../shared/lib';
import { actions } from '../store';

const IS_WINDOWS_PLATFORM = process.platform === 'win32';

/**
 * AppBar Component
 */
export default () => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const directory = useSelector((state) => state.directory);
  const dispatch = useDispatch();
  const [drives, setDrives] = React.useState([]);
  const [editing, setEditing] = React.useState(false);
  const [path, setPath] = React.useState('');

  const Form = styled('form')({
    width: '100%',
  });

  React.useEffect(() => {
    if (IS_WINDOWS_PLATFORM) {
      (async () => {
        const driveList = await util.listWindowsDrives();
        driveList.length && setDrives(driveList.map((name) => `${name}/`));
      })();
    }
  }, []);

  const makeDriveChange = (driveName) => () => {
    dispatch(actions.directory.set(driveName));
    setAnchorEl(null);
  };

  const onEditPath = () => {
    setEditing(true);
    setPath(directory);
  };

  const onMenuClose = () => setAnchorEl(null);

  const onMenuOpen = (event) => setAnchorEl(event.currentTarget);

  const onPathChange = (event) => setPath(event.target.value);

  const onPathSet = (event) => {
    event.preventDefault();
    if (path !== directory) try {
      const stats = statSync(path);
      if (existsSync(path) && !stats.isFile()) {
        const next = util.getPosixPath(path);
        dispatch(actions.directory.set(next));
      }
    } catch (error) {
      console.error(error);
    }
    setEditing(false);
    setPath('');
  };

  return (
    <AppBar color='transparent' elevation={1}>
      <Toolbar disableGutters variant="dense">
        {IS_WINDOWS_PLATFORM ? (
          <IconButton onClick={onMenuOpen} sx={{ marginX: 2 }}>
            {anchorEl ? <SaveAsOutlined /> : <SaveOutlined />}
          </IconButton>
        ) : (
          <Avatar>
            <FolderOpen sx={{ marginX: 3 }} />
          </Avatar>
        )}
        {editing ? (
          <Form onSubmit={onPathSet} sx={{ flexGrow: 1 }}>
            <InputBase
              autoFocus
              fullWidth
              onBlur={onPathSet}
              onChange={onPathChange}
              value={path}
            />
          </Form>
        ) : (
          <InputBase
            fullWidth
            onClick={onEditPath}
            readOnly
            value={directory}
          />
        )}
      </Toolbar>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onMenuClose}>
        {drives.map((driveName, index) => (
          <MenuItem key={index} onClick={makeDriveChange(driveName)}>
            {driveName}
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
};
