import React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { ToggleOff, ToggleOn } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import actions from '../../store/actions';
import { appBarHeight } from '../../shared/variables';
import Background, { backgroundStyles } from './Background';
import Controls from './Controls';

/**
 * Media Video Component
 */
export default function () {
  const dispatch = useDispatch();
  const store = useStore();
  const media = useSelector((state) => state.media);
  const videoAutoplay = useSelector((state) => state.video.autoplay);
  const videoLoop = useSelector((state) => state.video.loop);
  const videoRef = React.useRef(0);
  const videoBgRef = React.useRef(0);
  const videoTime = React.useRef(0);

  const Video = styled('video')({
    display: 'block',
    width: '100%',
    height: `calc(100% - ${appBarHeight}px)`,
  });

  const VideoBg = styled('video')(backgroundStyles);

  const menuItems = React.useMemo(() => [
    {
      Icon: videoAutoplay ? ToggleOn : ToggleOff,
      onClick: () => {
        dispatch(actions.video.merge({ autoplay: !videoAutoplay }));
        videoTime.current = videoRef.current.currentTime;
      },
      label: 'Autoplay',
    },
    {
      Icon: videoLoop ? ToggleOn : ToggleOff,
      onClick: () => {
        dispatch(actions.video.merge({ loop: !videoLoop }));
        videoTime.current = videoRef.current.currentTime;
      },
      label: 'Loop',
    },
  ], [videoAutoplay, videoLoop]);

  const onSync = React.useCallback((event) => {
    if (videoBgRef.current) {
      videoBgRef.current.currentTime = event.target.currentTime;
      videoBgRef.current.playbackRate = event.target.playbackRate;
    }
  }, []);

  const onPause = React.useCallback((event) => {
    if (videoBgRef.current) {
      onSync(event);
      videoBgRef.current.pause();
    }
  }, []);

  const onPlay = React.useCallback((event) => {
    if (videoBgRef.current) {
      onSync(event);
      videoBgRef.current.play();
    }
  }, []);

  const onVolumeChange = (event) => {
    const { currentTime, muted, volume } = event.target;
    dispatch(actions.video.merge({ muted, volume }));
    videoTime.current = currentTime;
  };

  const setVideoAttr = React.useCallback(() => {
    if (videoRef.current) {
      const state = store.getState();
      const { video } = state;
      videoRef.current.muted = video.muted;
      videoRef.current.volume = video.volume;
      videoRef.current.currentTime = videoTime.current;
    }
  }, []);

  React.useEffect(() => {
    videoTime.current = 0;
    setVideoAttr();
  }, [media]);

  React.useEffect(setVideoAttr, [videoAutoplay, videoLoop]);

  return (
    <>
      <Background>
        <VideoBg
          autoPlay={videoAutoplay}
          loop={videoLoop}
          muted
          src={media.path}
          ref={videoBgRef}
        />
      </Background>
      <Video
        autoPlay={videoAutoplay}
        controls
        loop={videoLoop}
        onEnded={onSync}
        onPause={onPause}
        onPlay={onPlay}
        onRateChange={onSync}
        onSeeked={onSync}
        onSeeking={onSync}
        onVolumeChange={onVolumeChange}
        ref={videoRef}
        src={media.path}
      />
      <Controls menuItems={menuItems} />
    </>
  );
}
