import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import ScrollContainer from 'react-indiana-drag-scroll';
import actions from '../../store/actions';
import { useFileNavigation } from '../../shared/hooks';
import { appBarHeight } from '../../shared/variables';
import Background, { backgroundStyles } from './Background';
import Controls from './Controls';

/**
 * Media Image Component
 */
export default function () {
  const dispatch = useDispatch();
  const image = useSelector((state) => state.image);
  const media = useSelector((state) => state.media);
  const [onPreviousFile, onNextFile] = useFileNavigation();

  const Img = styled('img')({
    display: 'block',
    margin: '0 auto',
    width: /contain|width/.test(image.fit) ? '100%' : 'auto',
    height: image.fit === 'contain' ? '100%' : 'auto',
    objectFit: 'contain',
    userSelect: 'none',
    opacity: 0,
  });

  const ImgBg = styled('img')(backgroundStyles);

  const ImgScrollContainer = styled(ScrollContainer)({
    width: '100%',
    height: `calc(100% - ${appBarHeight}px)`,
  });

  const menuItems = React.useMemo(() => [
    {
      Icon: image.fit === 'none' ? RadioButtonChecked : RadioButtonUnchecked,
      onClick: () => dispatch(actions.image.merge({ fit: 'none' })),
      label: 'Fit None',
    },
    {
      Icon: image.fit === 'contain' ? RadioButtonChecked : RadioButtonUnchecked,
      onClick: () => dispatch(actions.image.merge({ fit: 'contain' })),
      label: 'Fit Contain',
    },
    {
      Icon: image.fit === 'width' ? RadioButtonChecked : RadioButtonUnchecked,
      onClick: () => dispatch(actions.image.merge({ fit: 'width' })),
      label: 'Fit Width',
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

  const onLeftClick = (event) => event.detail === 2 && onNextFile();

  const onLoad = (event) => {
    const img = event.target;
    const container = img.parentNode;
    imageTranslateY(img, container);
    img.style.opacity = 1;
  };

  React.useEffect(() => {
    const onResize = () => {
      const img = document.getElementById('media-img');
      const container = img.parentNode;
      imageTranslateY(img, container);
    };
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
      <ImgScrollContainer hideScrollbars={false}>
        <Img
          id="media-img"
          draggable={false}
          onClick={onLeftClick}
          onContextMenu={onPreviousFile}
          onLoad={onLoad}
          src={media.path}
        />
      </ImgScrollContainer>
      <Controls menuItems={menuItems} />
    </>
  );
}
