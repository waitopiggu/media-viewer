import React from 'react';
import { useSelector } from 'react-redux';
import { AppBar, Divider, Grid, Toolbar, Typography } from '@mui/material';
import { formatBytes } from '../../shared/util';
import { directoryListWidth } from '../../shared/var';

export const footerHeight = 32;

/**
 * Directory Footer Component
 */
export default function () {
  const files = useSelector((state) => state.files);

  const bytes = React.useMemo(() => {
    return files.reduce((previous, current) => previous + current.size, 0);
  }, [files]);

  return (
      <AppBar
        color="transparent"
        elevation={0}
        sx={{ bottom: 0, left: 0, top: 'auto', width: directoryListWidth }}
      >
        <Divider />
        <Toolbar disableGutters variant="dense" sx={{ minHeight: footerHeight }}>
          <Grid container direction="row" justifyContent="space-between">
            <Typography sx={{ marginLeft: 2 }} variant="caption">
              {`${files.length} Files`}
            </Typography>
            <Typography sx={{ marginRight: 2 }} variant="caption">
              {formatBytes(bytes)}
            </Typography>
          </Grid>
        </Toolbar>
      </AppBar>
  );
}
