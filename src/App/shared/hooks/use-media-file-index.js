import React from 'react';
import { useSelector } from 'react-redux';

/**
 * Use File Media-index Hook
 */
export default () => {
  const files = useSelector((state) => state.files);
  const media = useSelector((state) => state.media);

  return React.useMemo(() => (
    files.findIndex((file) => file.name === media.name)
  ), [files, media])
};
