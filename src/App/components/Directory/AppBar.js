import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dirname } from 'path';
import { debounce, reverse, shuffle } from 'lodash';
import {
  AppBar, Divider, IconButton, InputBase, Menu, MenuItem, Toolbar, Tooltip,
} from '@mui/material';
import { DriveFolderUpload, Sort } from '@mui/icons-material';
import actions from '../../store/actions';
import { naturalSortBy } from '../../shared/util';

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

  const onSortFiles = (value) => {
    const next = files.slice();
    dispatch(actions.files.set(sort === value ? reverse(next) : (
      next.sort(naturalSortBy(value))
    )));
    setSort(value);
    setAnchorEl(null);
  };

  const menuItems = React.useMemo(() => [
    {
      label: 'Name',
      onClick: () => onSortFiles('name'),
      selected: sort === 'name',
    },
    {
      func: (value) => new Date(value),
      label: 'Date',
      onClick: () => onSortFiles('date'),
      selected: sort === 'date',
    },
    {
      func: (value) => new Date(value),
      label: 'Size',
      onClick: () => onSortFiles('size'),
      selected: sort === 'size',
    },
    {
      label: 'Type',
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
          <Tooltip placement="right" title="Parent Directory">
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
          <Tooltip placement="left" title="Sort Files">
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
          Shuffle
        </MenuItem>
      </Menu>
    </>
  );
}
