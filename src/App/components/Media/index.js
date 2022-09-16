import React from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { appBarHeight, directoryListWidth } from '../../shared/variables';
import Image from './Image';
import Video from './Video';

/**
 * Media Component
 */
export default () => {
  const media = useSelector((state) => state.media);

  return media && (media.isImage || media.isVideo) ? (
    <Box sx={{
      width: `calc(100% - ${directoryListWidth}px)`,
      height: `calc(100vh - ${appBarHeight}px)`,
      position: 'relative',
    }}>
      {media.isImage && <Image {...media} />}
      {media.isVideo && <Video {...media} />}
    </Box>
  ) : null;
};
