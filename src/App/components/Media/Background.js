import React from 'react';
import { styled } from '@mui/material/styles';
import { appBarHeight } from '../../shared/variables';

export const backgroundStyles = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  userSelect: 'none',
  filter: 'blur(16px)',
  opacity: 0.6,
};

const Container = styled('div')({
  backgroundColor: '#333',
  width: '100%',
  height: `calc(100% - ${appBarHeight}px)`,
  position: 'absolute',
  overflow: 'hidden',
  zIndex: -1,
});

const Shade = styled('div')({
  backgroundColor: '#333',
  width: '100%',
  height: '100%',
  filter: 'blur(16px)',
  position: 'absolute',
  top: 0,
  left: 0,
  opacity: 0.4,
});

/**
 * Media Background Container
 */
export default function ({ children }) {
  return (
    <Container>
      {children}
      <Shade />
    </Container>
  );
}
