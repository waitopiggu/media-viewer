import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dirname } from 'path';
import { debounce, reverse, shuffle, sortBy } from 'lodash';
import {
  AppBar, Divider, IconButton, InputBase, Menu, MenuItem, Toolbar, Tooltip,
} from '@mui/material';
import { DriveFolderUpload, Sort } from '@mui/icons-material';
import actions from '../../store/actions';

const DELAY_MS = 300;

const buttonStyle = {
  marginLeft: 2,
  marginRight: 2,
};

/**
 * Directory AppBar Component
 */
export default function ({ onFileSearch }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const directory = useSelector((state) => state.directory);
  const files = useSelector((state) => state.files);
  const [searchValue, setSearchValue] = React.useState('');
  const [sort, setSort] = React.useState('name');

  const parentDir = React.useMemo(() => dirname(directory), [directory]);

  const onSortFiles = (value, func) => {
    dispatch(actions.files.set(
      sort === value ? reverse(files.slice()) : sortBy(files, func || value),
    ));
    setSort(value);
    setAnchorEl(null);
  };

  const menuItems = React.useMemo(() => [
    {
      label: 'Sort by name',
      onClick: () => onSortFiles('name'),
      selected: sort === 'name',
    },
    {
      func: (value) => new Date(value),
      label: 'Sort by date',
      onClick: () => onSortFiles('date'),
      selected: sort === 'date',
    },
    {
      label: 'Sort by type',
      onClick: () => onSortFiles('type'),
      selected: sort === 'type',
    },
  ], [onSortFiles, sort]);

  const onSearchValueChanged = debounce(onFileSearch, DELAY_MS);

  const onInputChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);
    onSearchValueChanged(value.toLowerCase());
  };

  const onMenuClose = () => setAnchorEl(null);

  const onMenuOpen = (event) => setAnchorEl(event.currentTarget);

  const onParentDirClick = () => {
    dispatch(actions.directory.set(parentDir));
    onFileSearch('');
    setSearchValue('');
  };

  const onShuffleFiles = () => {
    dispatch(actions.files.set(shuffle(files.slice())));
    setSort('shuffle');
    setAnchorEl(null);
  };

  React.useEffect(() => {
    setSort('name');
  }, [directory]);

  return (
    <>
      <AppBar color="transparent" elevation={0} position="relative">
        <Toolbar disableGutters variant="dense">
          <Tooltip title="Parent Directory">
            <IconButton
              disabled={parentDir === directory}
              onClick={onParentDirClick}
              sx={buttonStyle}
            >
              <DriveFolderUpload />
            </IconButton>
          </Tooltip>
          <InputBase
            fullWidth
            onChange={onInputChange}
            placeholder="Search files..."
            value={searchValue}
          />
          <Tooltip title="Sort Files">
            <IconButton onClick={onMenuOpen} sx={buttonStyle}>
              <Sort />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onMenuClose}>
        {menuItems.map(({ label, onClick, selected }) => (
          <MenuItem key={label} onClick={onClick} selected={selected}>
            {label}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={onShuffleFiles} selected={sort === 'shuffle'}>
          Shuffle files
        </MenuItem>
      </Menu>
    </>
  );
}