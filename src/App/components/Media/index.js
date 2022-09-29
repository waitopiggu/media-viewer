import React from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { useMedia } from '../../shared/hooks';
import { appBarHeight, directoryListWidth } from '../../shared/var';
import Image from './Image';
import Video from './Video';

/**
 * Media Component
 */
export default function () {
  const directory = useSelector((state) => state.directory);
  const directoryFile = useSelector((state) => state.directoryFile);
  const files = useSelector((state) => state.files);
  const media = useMedia();

  return (
    <Box sx={{
      width: `calc(100% - ${directoryListWidth}px)`,
      height: `calc(100vh - ${appBarHeight}px)`,
      position: 'relative',
    }}>
      {media.isImage && <Image />}
      {media.isVideo && <Video />}
    </Box>
  );
}
