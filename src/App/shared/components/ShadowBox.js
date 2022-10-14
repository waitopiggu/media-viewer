import React, { forwardRef, useImperativeHandle } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const FADE_DISTANCE = 48;

const steps = [
  'rgba(0, 0, 0, 0.5) 0px',
  'rgba(0, 0, 0, 0.3) 1px',
  'rgba(0, 0, 0, 0.1) 3px',
  'rgba(0, 0, 0, 0.0) 6px',
];

const getOpacityBottomRight = (z, cz, sz) => (
  z < sz - cz - FADE_DISTANCE ? 1 : FADE_DISTANCE * (1 - (z / (sz - cz)))
);

const getOpacityTopLeft = (z, cz, sz) => (
  z < FADE_DISTANCE ? z / FADE_DISTANCE : 1
);

const getStyle = (side) => ({
  background: `linear-gradient(to ${side}, ${steps.join(',')})`,
});

/**
 * Shadow-box Component
 */
export default forwardRef(({
  height = '100%',
  left = 0,
  top = 0,
  width = '100%',
}, ref) => {
  const bottomRef = React.useRef(0);
  const leftRef = React.useRef(0);
  const rightRef = React.useRef(0);
  const topRef = React.useRef(0);

  useImperativeHandle(ref, () => ({
    /**
     * Display Shadow
     * @param {number} cl - client-left
     * @param {number} ct - client-top
     * @param {number} cw - client-width
     * @param {number} ch - client-height
     * @param {number} sw - scroll-width
     * @param {number} sh - scroll-height
     */
    calculate(cl, ct, cw, ch, sw, sh) {
      if (sw > cw) {
        leftRef.current.style.opacity = getOpacityTopLeft(cl, cw, sw);
        rightRef.current.style.opacity = getOpacityBottomRight(cl, cw, sw);
      } else {
        leftRef.current.style.opacity = 0;
        rightRef.current.style.opacity = 0;
      }
      if (sh > ch) {
        topRef.current.style.opacity = getOpacityTopLeft(ct, ch, sh);
        bottomRef.current.style.opacity = getOpacityBottomRight(ct, ch, sh);
      } else {
        topRef.current.style.opacity = 0;
        bottomRef.current.style.opacity = 0;
      }
    },
  }));

  const Shadow = styled('div')(({ theme }) => ({
    height,
    left,
    opacity: 0,
    pointerEvents: 'none',
    position: 'absolute',
    top,
    width,
    zIndex: theme.zIndex.appBar - 1,
  }));

  return (
    <>
      <Shadow ref={topRef} sx={getStyle('bottom')} />
      <Shadow ref={bottomRef} sx={getStyle('top')} />
      <Shadow ref={leftRef} sx={getStyle('right')} />
      <Shadow ref={rightRef} sx={getStyle('left')} />
    </>
  );
});