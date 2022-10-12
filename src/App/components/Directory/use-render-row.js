import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar, Box, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FolderOutlined, Image, Movie } from '@mui/icons-material';
import actions from '../../store/actions';
import { useMedia, useThumbs } from '../../shared/hooks';
import { formatBytes } from '../../shared/util';

/**
 * Directory Use Render-row Hook
 */
export default () => {
  const dispatch = useDispatch();
  const media = useMedia();
  const theme = useTheme();
  const thumbs = useThumbs();

  const makeItemClick = React.useCallback((item) => () => {
    dispatch(actions.directoryFile.merge({ [item.directory]: item }));
    item.isDirectory && dispatch(actions.directory.set(item.path));
  }, []);

  return React.useCallback(({ data, index, style }) => {
    const file = data[index];
    const selected = file.path === media.path;

    return (
      <ListItem component="div" disablePadding key={index} style={style}>
        <ListItemButton dense onClick={makeItemClick(file)} selected={selected}>
          <ListItemAvatar>
            <Avatar
              src={thumbs[file.path]}
              sx={{
                bgcolor: theme.palette.primary.main,
                '> img': {
                  opacity: selected ? 0.5 : 1,
                },
              }}
            >
              {file.isDirectory && <FolderOutlined />}
              {file.isImage && <Image />}
              {file.isVideo && <Movie />}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={(<Typography noWrap>{file.name}</Typography>)}
            secondary={(
              <Box component="span" sx={{ display: 'flex' }}>
                <Typography component="span" variant="caption">
                  {file.date.toLocaleString()}
                </Typography>
                {!file.isDirectory && (
                  <Typography
                    align="right"
                    component="span"
                    sx={{ flexGrow: 1 }}
                    variant="caption"
                  >
                    {formatBytes(file.size)}
                  </Typography>
                )}
              </Box>
            )}
          />
        </ListItemButton>
      </ListItem>
    );
  }, [media, thumbs]);
};
