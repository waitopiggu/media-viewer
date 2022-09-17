import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../store/actions';
import useMediaFileIndex from './use-media-file-index';

/**
 * Use File Navigation Hook
 */
export default () => {
  const dispatch = useDispatch();
  const files = useSelector((state) => state.files);
  const mediaFileIndex = useMediaFileIndex();

  const onPreviousFile = React.useCallback(() => {
    const nextIndex = Math.max(mediaFileIndex - 1, 0);
    dispatch(actions.media.set(files[nextIndex]));
  }, [files, mediaFileIndex]);

  const onNextFile = React.useCallback(() => {
    const nextIndex = Math.min(mediaFileIndex + 1, files.length - 1);
    dispatch(actions.media.set(files[nextIndex]));
  }, [files, mediaFileIndex]);

  return [onPreviousFile, onNextFile];
};
