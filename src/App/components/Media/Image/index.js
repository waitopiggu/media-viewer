import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { appBarHeight, directoryListWidth } from '../../../shared/variables';
import Controls from './Controls';

const initialState = {
  clientX: 0,
  clientY: 0,
  grabbing: false,
};

/**
 * Image Component
 */
export default () => {
  const boxRef = React.useRef(0);
  const image = useSelector((state) => state.image);
  const media = useSelector((state) => state.media);
  const [state, setState] = React.useState({ ...initialState });

  const Img = styled('img')({
    cursor: state.grabbing ? 'grabbing' : 'grab',
    display: 'block',
    margin: '0 auto',
    width: /contain|width/.test(image.fit) ? '100%' : 'auto',
    height: image.fit === 'contain' ? '100%' : 'auto',
    objectFit: 'contain',
  });

  React.useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollLeft = 0;
      boxRef.current.scrollTop = 0;
    }
  }, [media]);

  const onMouseDown = (event) => {
    const { clientX, clientY } = event;
    setState({ clientX, clientY, grabbing: true });
  };

  const onMouseMove = (event) => {
    const { clientX, clientY, grabbing } = state;
    if (grabbing) {
      boxRef.current.scrollTop += (clientY - event.clientY);
      boxRef.current.scrollLeft += (clientX - event.clientX);
      setState({ ...state, clientX: event.clientX, clientY: event.clientY });
    }
  };

  const onMouseUp = (event) => {
    setState({ ...state, grabbing: false });
  };

  return (
    <Box
      sx={{
        width: `calc(100% - ${directoryListWidth}px)`,
        height: `calc(100vh - ${appBarHeight}px)`,
      }}
    >
      <Box
        ref={boxRef}
        sx={{
          width: '100%',
          height: `calc(100% - ${appBarHeight}px)`,
          overflow: 'auto',
        }}
      >
        <Img
          draggable={false}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          src={media.path}
        />
      </Box>
      <Controls />
    </Box>
  );
};
