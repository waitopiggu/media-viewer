import React from 'react';
import { styled } from '@mui/material/styles';
import { appBarHeight } from '../../shared/var';

export const backgroundStyles = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  userSelect: 'none',
};

const Container = styled('div')({
  backgroundColor: '#444',
  width: '100%',
  height: `calc(100% - ${appBarHeight}px)`,
  position: 'absolute',
  overflow: 'hidden',
  zIndex: -1,
});

const Filter = styled('div')({
  width: '100%',
  height: '100%',
  backdropFilter: 'blur(16px)',
  transform: 'translate3d(0, 0, 0)',
  position: 'absolute',
  top: 0,
  left: 0,
});

/**
 * Media Background Container
 */
export default function ({ children }) {
  return (
    <Container>
      {children}
      <Filter />
    </Container>
  );
}
