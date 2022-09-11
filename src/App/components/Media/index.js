import React from 'react';
import { useSelector } from 'react-redux';
import Image from './Image';
import Video from './Video';

/**
 * Media Component
 */
export default () => {
  const media = useSelector((state) => state.media);

  return media && (media.isImage || media.isVideo) ? (
    <>
      {media.isImage && <Image {...media} />}
      {media.isVideo && <Video {...media} />}
    </>
  ) : null;
};
