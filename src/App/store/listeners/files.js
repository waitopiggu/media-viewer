import { readdirSync, statSync } from 'fs';
import { shuffle } from 'lodash';
import mime from 'mime-types';
import { util } from '../../shared';
import slices from '../slices';

const getPath = (dir, name) => `${dir}/${name}`.replace('//', '/', 'g');

const getSortedFiles = (files, { desc, value }) => {
  if (value === 'shuffle') {
    return shuffle(files.slice());
  }
  return files.slice().sort(util.naturalSortBy(value, desc));
};

export default [
  {
    actionCreator: slices.directory.actions.set,
    effect: async (action, listenerApi) => {
      const directory = action.payload;
      const filenames = readdirSync(directory);
      const { fileSort } = listenerApi.getState();
      let next = [];

      await Promise.all(filenames.map(async (name) => {
        try {
          const path = getPath(directory, name);
          const stats = statSync(path);
          const type = mime.lookup(path);

          const file = {
            date: stats.birthtime,
            directory,
            name,
            isDirectory: !stats.isFile(),
            isImage: /image\/*/.test(type),
            isVideo: /video\/*/.test(type),
            path,
            size: stats.size,
            type,
          };

          (file.isDirectory || file.isImage || file.isVideo) && next.push(file);
        } catch (error) {
          console.error(error);
        }
        return Promise.resolve();
      }));

      next = getSortedFiles(next, fileSort);
      listenerApi.dispatch(slices.files.actions.set(next));
    },
  },
  {
    actionCreator: slices.fileSort.actions.set,
    effect: (action, listenerApi) => {
      const { files } = listenerApi.getState();
      const next = getSortedFiles(files, action.payload);
      listenerApi.dispatch(slices.files.actions.set(next));
    },
  },
];
