import React from 'react';
import { Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

/**
 * Styled Divider Component
 */
export default styled(Divider)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
}));
