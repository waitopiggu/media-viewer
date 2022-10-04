import React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import {
  Avatar,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { FolderOutlined, Image, Movie } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import actions from '../../store/actions';
import { useMedia } from '../../shared/hooks';
import { formatBytes } from '../../shared/util';
import { appBarHeight, directoryListWidth } from '../../shared/var';
import Header from './Header';
import Footer from './Footer';

const LIST_ITEM_HEIGHT = 64;
const LIST_OVERSCAN_COUNT = 5;

/**
 * Directory Component
 */
export default function () {
  const dispatch = useDispatch();
  const files = useSelector((state) => state.files);
  const [fileSearch, setFileSearch] = React.useState('');
  const listRef = React.useRef(0);
  const media = useMedia();
  const thumbs = useSelector((state) => state.thumbs);
  const store = useStore();
  const theme = useTheme();

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
      dispatch(actions.directoryFile.merge({ [item.directory]: item }));
    }
  };

  const onListRef = React.useCallback((listEl) => {
    listRef.current = listEl;
    if (listRef.current) {
      const index = files.findIndex((file) => media && file.path === media.path);
      listRef.current.scrollToItem(index < 0 ? 0 : index, 'smart');
    }
  }, [files, media]);

  const renderRow = ({ data, index, style }) => {
    const file = data[index];

    return (
      <ListItem component="div" disablePadding key={index} style={style}>
        <ListItemButton
          dense
          onClick={makeItemClick(file)}
          selected={media && media.path === file.path}
        >
          <ListItemAvatar>
            <Avatar
              src={thumbs[file.path]}
              sx={{ bgcolor: theme.palette.primary.main }}
            >
              {file.isDirectory && <FolderOutlined />}
              {file.isImage && <Image />}
              {file.isVideo && <Movie />}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={(<Typography noWrap>{file.name}</Typography>)}
            secondary={(
              <Box component="span" sx={{ display: 'flex' }}>
                <Typography component="span" variant="caption">
                  {file.date.toLocaleString()}
                </Typography>
                {!file.isDirectory && (
                  <Typography
                    align="right"
                    component="span"
                    sx={{ flexGrow: 1 }}
                    variant="caption"
                  >
                    {formatBytes(file.size)}
                  </Typography>
                )}
              </Box>
            )}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Box sx={{
      width: directoryListWidth,
      height: `calc(100vh - ${appBarHeight * 3}px)`,
    }}>
      <Header onFileSearch={setFileSearch} />
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
      <Footer />
    </Box>
  );
}
