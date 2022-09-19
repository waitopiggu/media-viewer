import React from 'react';
import { styled } from '@mui/material/styles';
import { appBarHeight } from '../../shared/variables';

export const backgroundStyles = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  userSelect: 'none',
  opacity: 0.6,
};

const Backdrop = styled('div')({
  width: '100%',
  height: '100%',
  position: 'absolute',
  backdropFilter: 'blur(16px)',
  zIndex: 10,
});

const Container = styled('div')({
  backgroundColor: '#333',
  width: '100%',
  height: `calc(100% - ${appBarHeight}px)`,
  position: 'absolute',
  overflow: 'hidden',
  zIndex: -1,
});

/**
 * Media Background Container
 */
export default function ({ children }) {
  return (
    <Container>
      <Backdrop />
      {children}
    </Container>
  );
}
