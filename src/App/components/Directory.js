import React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { reverse, sortBy } from 'lodash';
import { dirname } from 'path';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { DriveFolderUpload, FolderOutlined, Sort } from '@mui/icons-material';
import { actions } from '../store';
import { useMediaFileIndex } from '../shared/hooks';
import { appBarHeight, directoryListWidth } from '../shared/variables';

const LIST_ITEM_HEIGHT = 72;
const LIST_OVERSCAN_COUNT = 5;
const LIST_PARENT_DIR_HEIGHT = 56;

/**
 * Directory List Component
 */
export default () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const directory = useSelector((state) => state.directory);
  const dispatch = useDispatch();
  const files = useSelector((state) => state.files);
  const listRef = React.useRef(0);
  const media = useSelector((state) => state.media);
  const mediaFileIndex = useMediaFileIndex();
  const thumbs = useSelector((state) => state.thumbs);
  const [sort, setSort] = React.useState('name');
  const store = useStore();

  React.useEffect(() => {
    const storeDirectory = store.getState().directory;
    dispatch(actions.directory.set(storeDirectory))
  }, []);

  const onSortFiles = React.useCallback((value, func) => {
    let nextFiles = (
      sort === value ? reverse(files.slice()) : sortBy(files, func || value)
    );
    dispatch(actions.files.set(nextFiles));
    setAnchorEl(null);
    setSort(value);
  }, [files, sort]);

  const menuItems = React.useMemo(() => [
    {
      label: 'Sort by name',
      onClick: () => onSortFiles('name'),
      selected: sort === 'name',
    },
    {
      func: (value) => new Date(value),
      label: 'Sort by date',
      onClick: () => onSortFiles('date'),
      selected: sort === 'date',
    },
    {
      label: 'Sort by type',
      onClick: () => onSortFiles('type'),
      selected: sort === 'type',
    },
  ], [onSortFiles, sort]);

  const makeItemClick = (item) => () => {
    if (item.isDirectory) {
      dispatch(actions.directory.set(item.path));
    } else {
      dispatch(actions.media.set(item));
    }
  };

  const onListRef = React.useCallback((listEl) => {
    listRef.current = listEl;
    if (listRef.current && mediaFileIndex >= 0) {
      listRef.current.scrollToItem(mediaFileIndex, 'smart');
    }
  }, [files, mediaFileIndex]);

  const onMenuClose = () => setAnchorEl(null);

  const onMenuOpen = (event) => setAnchorEl(event.currentTarget);

  const onParentDirClick = () => {
    dispatch(actions.directory.set(dirname(directory)));
    listRef.current && listRef.current.scrollToItem(0);
  };

  const renderRow = ({ data, index, style }) => {
    const file = data[index];
    return (
      <ListItem
        component="div"
        disablePadding
        key={index}
        style={style}
      >
        <ListItemButton
          onClick={makeItemClick(file)}
          selected={media && media.path === file.path}
        >
          <ListItemAvatar>
            <Avatar src={file.isImage ? file.path : thumbs[file.path]}>
              <FolderOutlined />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={(<Typography noWrap>{file.name}</Typography>)}
            secondary={file.date.toLocaleString()}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Box sx={{
      width: directoryListWidth,
      height: `calc(100vh - ${appBarHeight + LIST_PARENT_DIR_HEIGHT}px)`,
    }}>
      <ListItem component="div" disablePadding secondaryAction={(
        <IconButton onClick={onMenuOpen}><Sort /></IconButton>
      )}>
        <ListItemButton onClick={onParentDirClick}>
          <ListItemAvatar>
            <Avatar><DriveFolderUpload /></Avatar>
          </ListItemAvatar>
          {'..'}
        </ListItemButton>
      </ListItem>
      <Divider />
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            width={width}
            itemCount={files.length}
            itemData={files}
            itemSize={LIST_ITEM_HEIGHT}
            overscanCount={LIST_OVERSCAN_COUNT}
            ref={onListRef}
          >
            {renderRow}
          </FixedSizeList>
        )}
      </AutoSizer>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onMenuClose}>
        {menuItems.map(({ label, onClick, selected }, index) => (
          <MenuItem key={index} onClick={onClick} selected={selected}>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
