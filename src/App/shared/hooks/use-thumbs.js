import React from 'react';
import { useSelector } from 'react-redux';
import { getMediaThumb } from '../util';

/**
 * Use Thumbs Hook
 */
export default () => {
  const files = useSelector((state) => state.files);
  const [thumbs, setThumbs] = React.useState({});

  React.useEffect(() => {
    (async () => {
      const media = files.filter((file) => file.isImage || file.isVideo);
      const next = {};

      await Promise.all(media.map(async (file) => {
        const thumb = await getMediaThumb(file);
        next[thumb.path] = thumb.dataUrl;
        return Promise.resolve();
      }));

      setThumbs(next);
    })();
  }, [files]);

  return thumbs;
};
