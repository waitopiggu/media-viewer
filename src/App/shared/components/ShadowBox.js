import React, { forwardRef, useImperativeHandle } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const FROM_COLOR = 'rgba(0, 0, 0, 0.2) 0px';
const TO_COLOR = 'rgba(0, 0, 0, 0) 5px';

const getStyle = (position) => ({
  background: `linear-gradient(to ${position}, ${FROM_COLOR}, ${TO_COLOR})`,
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
     * @param {number} x - x-offset
     * @param {number} y - y-offset
     * @param {number} cw - client-width
     * @param {number} ch - client-height
     * @param {number} sw - scroll-width
     * @param {number} sh - scroll-height
     */
    calculate(x, y, cw, ch, sw, sh) {
      if (sw > cw) {
        leftRef.current.style.opacity = Number(x > 0);
        rightRef.current.style.opacity = Number(Math.round(x + cw) < Math.round(sw));
      } else {
        leftRef.current.style.opacity = 0;
        rightRef.current.style.opacity = 0;
      }
      if (sh > ch) {
        topRef.current.style.opacity = Number(y > 0);
        bottomRef.current.style.opacity = Number(Math.round(y + ch) < Math.round(sh));
      } else {
        topRef.current.style.opacity = 0;
        bottomRef.current.style.opacity = 0;
      }
    },
  }));

  const Shadow = styled('div')({
    height,
    left,
    opacity: 0,
    pointerEvents: 'none',
    position: 'absolute',
    top,
    transition: 'opacity 0.3s ease',
    width,
  });

  return (
    <>
      <Shadow ref={topRef} sx={getStyle('bottom')} />
      <Shadow ref={bottomRef} sx={getStyle('top')} />
      <Shadow ref={leftRef} sx={getStyle('right')} />
      <Shadow ref={rightRef} sx={getStyle('left')} />
    </>
  );
});
