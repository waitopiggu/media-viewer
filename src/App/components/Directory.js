import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dirname } from 'path';
import { find } from 'lodash';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import {
  Avatar,
  Box,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { DriveFolderUpload, FolderOutlined } from '@mui/icons-material';
import { actions } from '../store';
import { directoryListWidth } from '../shared/variables';

/**
 * Directory List Component
 */
export default () => {
  const dispatch = useDispatch();
  const directory = useSelector((state) => state.directory);
  const files  = useSelector((state) => state.files);
  const media = useSelector((state) => state.media);
  const thumbs = useSelector((state) => state.thumbs);
  const listRef = React.useRef(0);

  const makeItemClick = (item) => () => {
    if (item.isDirectory) {
      dispatch(actions.directory.set(item.path));
    } else {
      dispatch(actions.media.set(item));
    }
  };

  const onListRef = React.useCallback((listEl) => {
    listRef.current = listEl;
    if (listRef.current && media) {
      const file = find(files.list, (item) => media.name === item.name);
      file && listRef.current.scrollToItem(file.index, 'smart');
    }
  }, [media]);

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
          <ListItemText>
            <Typography noWrap>{file.name}</Typography>
          </ListItemText>
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Box sx={{
      width: directoryListWidth,
      height: 'calc(100vh - 88px)',
    }}>
      <ListItem component="div" disablePadding>
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
            itemSize={57}
            overscanCount={5}
            ref={onListRef}
          >
            {renderRow}
          </FixedSizeList>
        )}
      </AutoSizer>
    </Box>
  );
}
