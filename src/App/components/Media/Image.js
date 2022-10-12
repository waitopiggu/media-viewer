import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import {
  RadioButtonChecked, RadioButtonUnchecked, ToggleOff, ToggleOn,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import ScrollContainer from 'react-indiana-drag-scroll';
import actions from '../../store/actions';
import { ShadowBox } from '../../shared/components';
import { useMedia } from '../../shared/hooks';
import { appBarHeight } from '../../shared/vars';
import Background, { backgroundStyles } from './Background';
import Controls from './Controls';

const DELAY_MS = 100;

/**
 * Media Image Component
 */
export default function () {
  const dispatch = useDispatch();
  const image = useSelector((state) => state.image);
  const media = useMedia();
  const scrollRef = React.useRef(0);
  const shadowBoxRef = React.useRef(0);

  const Img = styled('img')({
    display: 'block',
    margin: '0 auto',
    width: /contain|width/.test(image.fit) ? '100%' : 'auto',
    height: image.fit === 'contain' ? '100%' : 'auto',
    imageRendering: image.pixelated ? 'pixelated' : 'auto',
    objectFit: 'contain',
    userSelect: 'none',
    transition: 'opacity 0.1s ease',
    opacity: 0,
  });

  const ImgBg = styled('img')(backgroundStyles);

  const ImgScrollContainer = styled(ScrollContainer)({
    width: '100%',
    height: `calc(100% - ${appBarHeight}px)`,
  });

  const menuItems = React.useMemo(() => [
    {
      subheader: 'Image Fit',
    },
    {
      Icon: image.fit === 'none' ? RadioButtonChecked : RadioButtonUnchecked,
      onClick: () => dispatch(actions.image.merge({ fit: 'none' })),
      label: 'None',
    },
    {
      Icon: image.fit === 'contain' ? RadioButtonChecked : RadioButtonUnchecked,
      onClick: () => dispatch(actions.image.merge({ fit: 'contain' })),
      label: 'Contain',
    },
    {
      Icon: image.fit === 'width' ? RadioButtonChecked : RadioButtonUnchecked,
      onClick: () => dispatch(actions.image.merge({ fit: 'width' })),
      label: 'Width',
    },
    {
      subheader: 'Image Render',
    },
    {
      Icon: image.pixelated ? ToggleOn : ToggleOff,
      onClick: () => dispatch(actions.image.merge({ pixelated: !image.pixelated })),
      label: 'Pixelated',
    },
  ], [image]);

  const imageTranslateY = (imgEl, containerEl) => {
    if (/none|width/.test(image.fit)) {
      const img = imgEl;
      const container = containerEl;
      if (img.height < container.clientHeight) {
        const y = 0.5 * (container.clientHeight - img.height);
        img.style.transform = `translateY(${y}px)`;
      } else {
        img.style.transform = '';
      }
    }
  };

  const onDisplayShadows = () => {
    if (scrollRef.current && shadowBoxRef.current) {
      const el = scrollRef.current.container.current;
      shadowBoxRef.current.calculate(
        el.scrollLeft,
        el.scrollTop,
        el.clientWidth,
        el.clientHeight,
        el.scrollWidth,
        el.scrollHeight,
      );
    }
  };

  const onLoad = (event) => {
    const img = event.target;
    const container = img.parentNode;
    imageTranslateY(img, container);
    img.style.opacity = 1;
    onDisplayShadows();
  };

  const onNext = (event) => {
    event.detail === 2 && dispatch(actions.directoryFile.navigate(1));
  };

  const onPrevious = () => {
    dispatch(actions.directoryFile.navigate(-1));
  };

  React.useEffect(() => {
    const onResize = debounce(() => {
      const img = document.getElementById('media-img');
      const container = img.parentNode;
      imageTranslateY(img, container);
    }, DELAY_MS);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [image]);

  return (
    <>
      <Background>
        <ImgBg draggable={false} src={media.path} />
      </Background>
      <ImgScrollContainer onScroll={onDisplayShadows} ref={scrollRef}>
        <Img
          id="media-img"
          draggable={false}
          onClick={onNext}
          onContextMenu={onPrevious}
          onLoad={onLoad}
          src={media.path}
        />
      </ImgScrollContainer>
      <ShadowBox height={`calc(100% - ${appBarHeight}px)`} ref={shadowBoxRef} />
      <Controls menuItems={menuItems} />
    </>
  );
}
