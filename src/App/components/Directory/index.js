import React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
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
import { FolderOutlined } from '@mui/icons-material';
import actions from '../../store/actions';
import { useMediaFileIndex } from '../../shared/hooks';
import { appBarHeight, directoryListWidth } from '../../shared/variables';
import AppBar from './AppBar';

const LIST_ITEM_HEIGHT = 72;
const LIST_OVERSCAN_COUNT = 5;

/**
 * Directory Component
 */
export default function () {
  const dispatch = useDispatch();
  const files = useSelector((state) => state.files);
  const [fileSearch, setFileSearch] = React.useState('');
  const listRef = React.useRef(0);
  const media = useSelector((state) => state.media);
  const mediaFileIndex = useMediaFileIndex();
  const thumbs = useSelector((state) => state.thumbs);
  const store = useStore();

  React.useEffect(() => {
    const storeDirectory = store.getState().directory;
    dispatch(actions.directory.set(storeDirectory));
  }, []);

  const filesSearched = React.useMemo(() => (fileSearch ? (
    files.filter((file) => file.name.toLowerCase().includes(fileSearch))
  ) : files), [files, fileSearch]);

  const makeItemClick = (item) => () => {
    if (item.isDirectory) {
      dispatch(actions.directory.set(item.path));
    } else {
      dispatch(actions.media.set(item));
    }
  };

  const onListRef = React.useCallback((listEl) => {
    listRef.current = listEl;
    if (listRef.current) {
      const index = mediaFileIndex >= 0 ? mediaFileIndex : 0;
      listRef.current.scrollToItem(index, 'smart');
    }
  }, [files, mediaFileIndex]);

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
      height: `calc(100vh - ${appBarHeight * 2}px)`,
    }}>
      <AppBar onFileSearch={setFileSearch} />
      <Divider />
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            width={width}
            itemCount={filesSearched.length}
            itemData={filesSearched}
            itemSize={LIST_ITEM_HEIGHT}
            overscanCount={LIST_OVERSCAN_COUNT}
            ref={onListRef}
          >
            {renderRow}
          </FixedSizeList>
        )}
      </AutoSizer>
    </Box>
  );
}
