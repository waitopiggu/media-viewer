import React, { forwardRef, useImperativeHandle } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const steps = [
  'rgba(0, 0, 0, 0.3) 0px',
  'rgba(0, 0, 0, 0.2) 1px',
  'rgba(0, 0, 0, 0.1) 2px',
  'rgba(0, 0, 0, 0.0) 3px',
];

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
        leftRef.current.style.opacity = Number(cl > 0);
        rightRef.current.style.opacity = Number(Math.round(cl + cw) < Math.round(sw));
      } else {
        leftRef.current.style.opacity = 0;
        rightRef.current.style.opacity = 0;
      }
      if (sh > ch) {
        topRef.current.style.opacity = Number(ct > 0);
        bottomRef.current.style.opacity = Number(Math.round(ct + ch) < Math.round(sh));
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
    transition: 'opacity 0.3s ease',
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
