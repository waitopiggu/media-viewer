import React from 'react';
import { styled } from '@mui/material/styles';
import { appBarHeight } from '../../shared/variables';

/**
 * Media Background Container Component
 */
export default styled('div')({
  width: '100%',
  height: `calc(100% - ${appBarHeight}px)`,
  backgroundColor: '#333',
  position: 'absolute',
  overflow: 'hidden',
  zIndex: -1,
});
