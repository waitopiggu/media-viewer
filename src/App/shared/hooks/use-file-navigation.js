import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../store';
import useMediaFileIndex from './use-media-file-index';

/**
 * Use File Navigation Hook
 */
export default () => {
  const dispatch = useDispatch();
  const files = useSelector((state) => state.files);
  const media = useSelector((state) => state.media);
  const mediaFileIndex = useMediaFileIndex();

  const onPreviousFile = React.useCallback(() => {
    let nextIndex = Math.max(mediaFileIndex - 1, 0);
    dispatch(actions.media.set(files[nextIndex]));
  }, [files, mediaFileIndex]);

  const onNextFile = React.useCallback(() => {
    let nextIndex = Math.min(mediaFileIndex + 1, files.length - 1);
    dispatch(actions.media.set(files[nextIndex]));
  }, [files, mediaFileIndex]);

  return [onPreviousFile, onNextFile];
};
