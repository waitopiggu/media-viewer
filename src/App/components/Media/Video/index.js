import React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { Box, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { actions } from '../../../store';
import { appBarHeight, directoryListWidth } from '../../../shared/variables'
import Controls from './Controls';

/**
 * Video Component
 */
export default () => {
  const dispatch = useDispatch()
  const store = useStore();
  const media = useSelector((state) => state.media);
  const videoAutoplay = useSelector((state) => state.video.autoplay);
  const videoLoop = useSelector((state) => state.video.loop);
  const videoRef = React.useRef(0);
  const videoTime = React.useRef(0);

  const Video = styled('video')({
    maxWidth: '100%',
    maxHeight: '100%',
    width: '100%',
    height: '100%',
  });

  const onVolumeChange = () => {
    if (videoRef.current) {
      const { muted, volume } = videoRef.current;
      dispatch(actions.video.merge({ muted, volume }));
    }
  };

  const onVideoStateChanging = () => {
    if (videoRef.current) {
      videoTime.current = videoRef.current.currentTime;
    }
  };

  const setVideoStateAttr = React.useCallback(() => {
    if (videoRef.current) {
      const state = store.getState();
      const video = state.video;
      videoRef.current.muted = video.muted;
      videoRef.current.volume = video.volume;
    }
  }, [store]);

  React.useEffect(setVideoStateAttr, [media, store]);

  React.useEffect(() => {
    setVideoStateAttr();
    if (videoRef.current && videoTime.current) {
      videoRef.current.currentTime = videoTime.current;
    }
  }, [store, videoAutoplay, videoLoop]);

  return (
    <Box
      sx={{
        width: `calc(100% - ${directoryListWidth}px)`,
        height: `calc(100vh - ${appBarHeight * 2}px)`,
      }}
    >
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={{ height: '100%', overflow: 'auto' }}
      >
        <Video
          autoPlay={videoAutoplay}
          controls
          loop={videoLoop}
          onVolumeChange={onVolumeChange}
          ref={videoRef}
          src={media.path}
        />
      </Grid>
      <Controls onVideoStateChanging={onVideoStateChanging} />
    </Box>
  );
};
