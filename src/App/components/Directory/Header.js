import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dirname } from 'path';
import { debounce, shuffle } from 'lodash';
import {
  AppBar, Box, Divider, IconButton, InputBase, Menu, MenuItem, Toolbar, Tooltip,
} from '@mui/material';
import { DriveFolderUpload, Sort } from '@mui/icons-material';
import actions from '../../store/actions';
import { PrimaryDivider } from '../../shared/components';
import { naturalSortBy } from '../../shared/util';
import { appBarHeight, directoryListWidth } from '../../shared/vars';

const DELAY_MS = 300;

const buttonStyle = {
  marginLeft: 2,
  marginRight: 2,
};

const initSort = { desc: false, value: 'name' };

/**
 * Directory Header Component
 */
export default function ({ onFileSearch }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const directory = useSelector((state) => state.directory);
  const files = useSelector((state) => state.files);
  const [searchValue, setSearchValue] = React.useState('');
  const [sort, setSort] = React.useState(initSort);

  const parentDir = React.useMemo(() => dirname(directory), [directory]);

  const onSortFiles = (value) => {
    let desc = value === sort.value && !sort.desc;
    let next = [];
    if (value === 'shuffle') {
      desc = false;
      next = shuffle(files.slice());
    } else {
      next = files.slice().sort(naturalSortBy(value, desc));
    }
    dispatch(actions.files.set(next));
    setAnchorEl(null);
    setSort({ desc, value });
  };

  const menuItems = React.useMemo(() => [
    {
      label: 'Name',
      onClick: () => onSortFiles('name'),
      selected: sort.value === 'name',
    },
    {
      label: 'Date',
      onClick: () => onSortFiles('date'),
      selected: sort.value === 'date',
    },
    {
      label: 'Size',
      onClick: () => onSortFiles('size'),
      selected: sort.value === 'size',
    },
    {
      label: 'Type',
      onClick: () => onSortFiles('type'),
      selected: sort.value === 'type',
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

  const onParentDir = () => {
    dispatch(actions.directory.set(parentDir));
    onFileSearch('');
    setSearchValue('');
  };

  const onShuffleFiles = () => onSortFiles('shuffle');

  React.useEffect(() => {
    setSort(initSort);
  }, [directory]);

  return (
    <>
      <Box sx={{ height: appBarHeight }} />
      <AppBar
        color="transparent"
        elevation={0}
        sx={{ top: appBarHeight, left: 0, width: directoryListWidth }}
      >
        <Toolbar disableGutters variant="dense">
          <Tooltip arrow placement="right" title="Parent Directory">
            <IconButton color="primary" onClick={onParentDir} sx={buttonStyle}>
              <DriveFolderUpload />
            </IconButton>
          </Tooltip>
          <InputBase
            fullWidth
            onChange={onInputChange}
            placeholder="Search files..."
            value={searchValue}
          />
          <Tooltip arrow placement="left" title="Sort Files">
            <IconButton color="primary" onClick={onMenuOpen} sx={buttonStyle}>
              <Sort />
            </IconButton>
          </Tooltip>
        </Toolbar>
        <PrimaryDivider />
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
