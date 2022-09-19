import React from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { FolderOpen, SaveOutlined, SaveAsOutlined } from '@mui/icons-material';
import actions from '../../store/actions';
import { util } from '../../shared/lib';

const IS_WINDOWS_PLATFORM = process.platform === 'win32';

/**
 * AppBar Drive Menu Button Component
 */
export default function () {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const [drives, setDrives] = React.useState([]);

  React.useEffect(() => {
    IS_WINDOWS_PLATFORM && (async () => {
      const driveList = await util.listWindowsDrives();
      driveList.length && setDrives(driveList.map((name) => `${name}/`));
    })();
  }, []);

  const makeDriveChange = (driveName) => () => {
    dispatch(actions.directory.set(driveName));
    setAnchorEl(null);
  };

  const onClose = () => setAnchorEl(null);

  const onOpen = (event) => setAnchorEl(event.currentTarget);

  return (
    <>
      {IS_WINDOWS_PLATFORM ? (
        <Tooltip title="Select Drive">
          <IconButton onClick={onOpen} sx={{ marginX: 2 }}>
            {anchorEl ? <SaveAsOutlined /> : <SaveOutlined />}
          </IconButton>
        </Tooltip>
      ) : (
        <Avatar>
          <FolderOpen sx={{ marginX: 3 }} />
        </Avatar>
      )}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
        {drives.map((driveName) => (
          <MenuItem key={driveName} onClick={makeDriveChange(driveName)}>
            {driveName}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
