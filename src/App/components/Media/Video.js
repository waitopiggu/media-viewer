import React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { ToggleOff, ToggleOn } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { actions } from '../../store';
import { appBarHeight } from '../../shared/variables';
import BgContainer from './BgContainer';
import Controls from './Controls';

/**
 * Media Video Component
 */
export default () => {
  const dispatch = useDispatch()
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

  const VideoBg = styled('canvas')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  });

  const menuItems = React.useMemo(() => [
    {
      Icon: videoAutoplay ? ToggleOn : ToggleOff,
      onClick: () => dispatch(actions.video.merge({ autoplay: !videoAutoplay })),
      label: 'Autoplay',
    },
    {
      Icon: videoLoop ? ToggleOn : ToggleOff,
      onClick: () => dispatch(actions.video.merge({ loop: !videoLoop })),
      label: 'Loop',
    },
  ], [videoAutoplay, videoLoop]);

  const makeVideoAttrStateChange = (attrs) => () => {
    if (videoRef.current) {
      videoTime.current = videoRef.current.currentTime;
      const next = attrs.reduce((payload, attrName) => ({
        ...payload, [attrName]: videoRef.current[attrName],
      }), {});
      dispatch(actions.video.merge(next));
    }
  };

  const onLoadedData = React.useCallback((event) => {
    const video = event.target;
    const canvas = document.getElementById('video-bg');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.filter = 'blur(16px)';
    let playing = false;
    const draw = () => {
      ctx.drawImage(video, 0, 0);
      playing && requestAnimationFrame(draw);
    };
    video.addEventListener('pause', () => playing = false);
    video.addEventListener('play', () => playing = true);
    video.addEventListener('seeked', draw);
    video.addEventListener('seeking', draw);
    video.addEventListener('timeupdate', draw);
    video.currentTime = 0.0;
  }, []);

  const setVideoAttr = React.useCallback(() => {
    if (videoRef.current) {
      const state = store.getState();
      const video = state.video;
      videoRef.current.muted = video.muted;
      videoRef.current.volume = video.volume;
    }
  }, []);

  React.useEffect(setVideoAttr, [media, store]);

  React.useEffect(() => {
    setVideoAttr();
    if (videoRef.current && videoTime.current) {
      videoRef.current.currentTime = videoTime.current;
    }
  }, [videoAutoplay, videoLoop]);

  return (
    <>
      <BgContainer>
        <VideoBg id="video-bg" />
      </BgContainer>
      <Video
        autoPlay={videoAutoplay}
        controls
        loop={videoLoop}
        onLoadedData={onLoadedData}
        onVolumeChange={makeVideoAttrStateChange(['muted', 'volume'])}
        ref={videoRef}
        src={media.path}
      />
      <Controls menuItems={menuItems} />
    </>
  );
};
