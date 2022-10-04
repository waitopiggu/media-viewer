import React from 'react';
import { normalize } from 'path';
import { existsSync, statSync } from 'fs';
import { useDispatch, useSelector } from 'react-redux';
import { dialog } from '@electron/remote';
import {
  AppBar, Divider, IconButton, InputBase, Toolbar, Tooltip, Typography,
} from '@mui/material';
import { FolderOpen } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import actions from '../store/actions';
import { useMedia } from '../shared/hooks';
import { util } from '../shared';

/**
 * AppBar Component
 */
export default function () {
  const directory = useSelector((state) => state.directory);
  const dispatch = useDispatch();
  const [editing, setEditing] = React.useState(false);
  const media = useMedia();
  const [path, setPath] = React.useState('');

  const Form = styled('form')({
    width: '100%',
  });

  const defaultPath = React.useMemo(() => (
    process.platform === 'win32' ? normalize(directory) : directory
  ), [directory]);

  const dirMedia = React.useMemo(() => (
    media && directory === media.directory ? media.path : directory
  ), [directory, media]);

  const onEditPath = () => {
    setEditing(true);
    setPath(directory);
  };

  const onPathChange = (event) => setPath(event.target.value);

  const onPathSet = (event) => {
    event.preventDefault();
    if (path !== directory) {
      try {
        const stats = statSync(path);
        if (existsSync(path) && !stats.isFile()) {
          const next = util.getPosixPath(path);
          dispatch(actions.directory.set(next));
        }
      } catch (error) {
        console.error(error);
      }
    }
    setEditing(false);
    setPath('');
  };

  const onShowDialog = async () => {
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        defaultPath,
        properties: ['openDirectory'],
      });
      if (!canceled) {
        const next = util.getPosixPath(filePaths[0]);
        dispatch(actions.directory.set(next));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AppBar elevation={0}>
      <Toolbar disableGutters variant="dense">
        <Tooltip placement="right" title="Open Directory">
          <IconButton onClick={onShowDialog} sx={{ color: 'inherit', marginX: 2 }}>
            <FolderOpen />
          </IconButton>
        </Tooltip>
        {editing ? (
          <Form onSubmit={onPathSet} sx={{ flexGrow: 1 }}>
            <InputBase
              autoFocus
              fullWidth
              onBlur={onPathSet}
              onChange={onPathChange}
              sx={{ color: 'inherit' }}
              value={path}
            />
          </Form>
        ) : (
          <Tooltip placement="right" title="Edit Path">
            <Typography
              onClick={onEditPath}
              sx={{
                cursor: 'pointer',
                marginBottom: '1px',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(0, 0, 0, 0)',
                transition: 'text-decoration-color 200ms',
                ':hover': {
                  textDecorationColor: 'inherit',
                },
              }}
            >
              {dirMedia}
            </Typography>
          </Tooltip>
        )}
      </Toolbar>
      <Divider />
    </AppBar>
  );
}
