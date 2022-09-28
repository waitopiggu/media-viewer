import { readdirSync, statSync } from 'fs';
import mime from 'mime-types';
import { util } from '../../shared';
import slices from '../slices';

export default [
  {
    actionCreator: slices.directory.actions.set,
    effect: async (action, listenerApi) => {
      const directory = action.payload;
      const filenames = readdirSync(directory);
      let next = [];

      await Promise.all(filenames.map(async (name) => {
        try {
          const path = `${directory}/${name}`;
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

      next = next.sort(util.naturalSortBy('name'));
      listenerApi.dispatch(slices.files.actions.set(next));
    },
  },
];
