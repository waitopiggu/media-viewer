import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import ScrollContainer from 'react-indiana-drag-scroll'
import { actions } from '../../store';
import { appBarHeight } from '../../shared/variables';
import Controls from './Controls';

/**
 * Media Image Component
 */
export default () => {
  const dispatch = useDispatch()
  const image = useSelector((state) => state.image);
  const media = useSelector((state) => state.media);

  const Img = styled('img')({
    display: 'block',
    margin: '0 auto',
    width: /contain|width/.test(image.fit) ? '100%' : 'auto',
    height: image.fit === 'contain' ? '100%' : 'auto',
    objectFit: 'contain',
    userSelect: 'none',
  });

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

  return (
    <>
      <ImgScrollContainer hideScrollbars={false}>
        <Img draggable={false} src={media.path} />
      </ImgScrollContainer>
      <Controls menuItems={menuItems} />
    </>
  );
};
