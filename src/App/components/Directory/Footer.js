import React from 'react';
import { useSelector } from 'react-redux';
import { AppBar, Divider, Grid, Toolbar, Typography } from '@mui/material';
import { formatBytes } from '../../shared/util';
import { directoryListWidth } from '../../shared/var';

function Text({ children }) {
  return (
    <Typography sx={{ marginX: 2 }} variant="subtitle2">{children}</Typography>
  );
}

/**
 * Directory Footer Component
 */
export default function () {
  const files = useSelector((state) => state.files);

  const bytes = React.useMemo(() => (
    files.reduce((previous, current) => previous + current.size, 0)
  ), [files]);

  return (
    <AppBar
      color="transparent"
      elevation={0}
      sx={{ bottom: 0, left: 0, top: 'auto', width: directoryListWidth }}
    >
      <Divider />
      <Toolbar disableGutters variant="dense">
        <Grid container direction="row" justifyContent="space-between">
          <Text>{`${files.length} Files`}</Text>
          <Text>{formatBytes(bytes)}</Text>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}