import React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import actions from '../../store/actions';
import { ShadowBox } from '../../shared/components';
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
  const shadowBoxRef = React.useRef(0);
  const store = useStore();

  const List = styled(FixedSizeList)({
    '::-webkit-scrollbar': {
      width: 0,
    },
  });

  const filesSearched = React.useMemo(() => (fileSearch ? (
    files.filter((file) => file.name.toLowerCase().includes(fileSearch))
  ) : files), [files, fileSearch]);

  const onDisplayShadows = () => {
    if (listRef.current && shadowBoxRef.current) {
      const { calculate } = shadowBoxRef.current;
      const { height, itemCount, itemSize } = listRef.current.props;
      const { scrollOffset } = listRef.current.state;
      calculate(0, scrollOffset, 0, height, 0, itemCount * itemSize);
    }
  };

  const onListRef = React.useCallback((listEl) => {
    listRef.current = listEl;
    if (listRef.current) {
      const index = files.findIndex((file) => file.path === media.path);
      listRef.current.scrollToItem(index < 0 ? 0 : index, 'smart');
      onDisplayShadows();
    }
  }, [files, media]);

  React.useEffect(() => {
    const storeDirectory = store.getState().directory;
    dispatch(actions.directory.set(storeDirectory));
    window.addEventListener('resize', onDisplayShadows);
    return () => {
      window.removeEventListener('resize', onDisplayShadows);
    };
  }, []);

  return (
    <Box sx={{
      height: `calc(100vh - ${appBarHeight * 3}px)`,
      width: directoryListWidth,
    }}>
      <Header onFileSearch={setFileSearch} />
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            width={width}
            itemCount={filesSearched.length}
            itemData={filesSearched}
            itemSize={LIST_ITEM_HEIGHT}
            onScroll={onDisplayShadows}
            overscanCount={LIST_OVERSCAN_COUNT}
            ref={onListRef}
          >
            {renderRow}
          </List>
        )}
      </AutoSizer>
      <ShadowBox ref={shadowBoxRef} top={appBarHeight} />
      <Footer />
    </Box>
  );
}
