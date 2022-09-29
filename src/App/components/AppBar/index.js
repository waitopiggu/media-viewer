import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { existsSync, statSync } from 'fs';
import { AppBar, Divider, InputBase, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import actions from '../../store/actions';
import { useMedia } from '../../shared/hooks';
import { util } from '../../shared';
import DriveMenuButton from './DriveMenuButton';

/**
 * AppBar Component
 */
export default function () {
  const directory = useSelector((state) => state.directory);
  const dispatch = useDispatch();
  const [editing, setEditing] = React.useState(false);
  const media = useMedia();
  const [path, setPath] = React.useState('');

  const dirMedia = React.useMemo(() => {
    if (media && directory === media.directory) {
      return media.path;
    }
    return directory;
  }, [directory, media]);

  const Form = styled('form')({
    width: '100%',
  });

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

  return (
    <AppBar color="transparent" elevation={0}>
      <Toolbar disableGutters variant="dense">
        <DriveMenuButton />
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
            value={dirMedia}
          />
        )}
      </Toolbar>
      <Divider />
    </AppBar>
  );
}
