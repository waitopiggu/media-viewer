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
  const autoplay = useSelector((state) => state.video.autoplay);
  const loop = useSelector((state) => state.video.loop);
  const time = React.useRef(0);
  const videoRef = React.useRef(0);
  const videoBgRef = React.useRef(0);

  const Video = styled('video')({
    display: 'block',
    width: '100%',
    height: `calc(100% - ${appBarHeight}px)`,
  });

  const VideoBg = styled('video')(backgroundStyles);

  const menuItems = React.useMemo(() => [
    {
      Icon: autoplay ? ToggleOn : ToggleOff,
      onClick: () => {
        dispatch(actions.video.merge({ autoplay: !autoplay }));
        time.current = videoRef.current.currentTime;
      },
      label: 'Autoplay',
    },
    {
      Icon: loop ? ToggleOn : ToggleOff,
      onClick: () => {
        dispatch(actions.video.merge({ loop: !loop }));
        time.current = videoRef.current.currentTime;
      },
      label: 'Loop',
    },
  ], [autoplay, loop]);

  const onSync = (event) => {
    videoBgRef.current.currentTime = event.target.currentTime;
    videoBgRef.current.playbackRate = event.target.playbackRate;
  };

  const onPause = (event) => {
    onSync(event);
    videoBgRef.current.pause();
  };

  const onPlay = (event) => {
    onSync(event);
    videoBgRef.current.play();
  };

  const onRateChange = (event) => {
    onSync(event);
    const { currentTime, playbackRate } = event.target;
    dispatch(actions.video.merge({ playbackRate }));
    time.current = currentTime;
  };

  const onVolumeChange = (event) => {
    const { currentTime, muted, volume } = event.target;
    dispatch(actions.video.merge({ muted, volume }));
    time.current = currentTime;
  };

  const setVideoAttr = (currentTime) => {
    const state = store.getState();
    const { video } = state;
    videoRef.current.currentTime = currentTime;
    videoRef.current.muted = video.muted;
    videoRef.current.playbackRate = video.playbackRate;
    videoRef.current.volume = video.volume;
  };

  React.useEffect(() => setVideoAttr(0), [media]);

  React.useEffect(() => setVideoAttr(time.current), [autoplay, loop]);

  return (
    <>
      <Background>
        <VideoBg
          autoPlay={autoplay}
          loop={loop}
          muted
          src={media.path}
          ref={videoBgRef}
        />
      </Background>
      <Video
        autoPlay={autoplay}
        controls
        loop={loop}
        onEnded={onSync}
        onPause={onPause}
        onPlay={onPlay}
        onRateChange={onRateChange}
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
