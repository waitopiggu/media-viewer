import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../store';

/**
 * Use File Navigation Hook
 */
export default () => {
  const dispatch = useDispatch();
  const files = useSelector((state) => state.files);
  const media = useSelector((state) => state.media);

  const onPreviousFile = React.useCallback(() => {
    let nextIndex = Math.max(media.index - 1, 0);
    dispatch(actions.media.set(files[nextIndex]));
  }, [files, media]);

  const onNextFile = React.useCallback(() => {
    let nextIndex = Math.min(media.index + 1, files.length - 1);
    dispatch(actions.media.set(files[nextIndex]));
  }, [files, media]);

  return [onPreviousFile, onNextFile]
};
