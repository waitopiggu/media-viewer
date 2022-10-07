import React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import { Box } from '@mui/material';
import actions from '../../store/actions';
import { useMedia } from '../../shared/hooks';
import { appBarHeight, directoryListWidth } from '../../shared/vars';
import Header from './Header';
import Footer from './Footer';
import useRenderRow from './use-render-row';

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
  const renderRow = useRenderRow();
  const store = useStore();

  React.useEffect(() => {
    const storeDirectory = store.getState().directory;
    dispatch(actions.directory.set(storeDirectory));
  }, []);

  const filesSearched = React.useMemo(() => (fileSearch ? (
    files.filter((file) => file.name.toLowerCase().includes(fileSearch))
  ) : files), [files, fileSearch]);

  const onListRef = React.useCallback((listEl) => {
    listRef.current = listEl;
    if (listRef.current) {
      const index = files.findIndex((file) => file.path === media.path);
      listRef.current.scrollToItem(index < 0 ? 0 : index, 'smart');
    }
  }, [files, media]);

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
