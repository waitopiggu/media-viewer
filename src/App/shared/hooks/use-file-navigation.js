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
    const index = (mediaFileIndex + files.length - 1) % files.length;
    dispatch(actions.media.set(files[index]));
  }, [files, mediaFileIndex]);

  const onNextFile = React.useCallback(() => {
    const index = (mediaFileIndex + 1) % files.length;
    dispatch(actions.media.set(files[index]));
  }, [files, mediaFileIndex]);

  return [onPreviousFile, onNextFile];
};
