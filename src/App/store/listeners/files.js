import { readdirSync, statSync } from 'fs';
import mime from 'mime-types';
import slices from '../slices';

export default [
  {
    actionCreator: slices.directory.actions.set,
    effect: (action, listenerApi) => {
      const directory = action.payload;
      const next = [];

      for (let name of readdirSync(directory)) try {
        const path = `${directory}/${name}`;
        const stats = statSync(path);
        const type = mime.lookup(path);

        const date = stats.birthtime;
        const isDirectory = !stats.isFile();
        const isImage = /image\/*/.test(type);
        const isVideo = /video\/*/.test(type);

        (isDirectory || isImage || isVideo) && next.push({
          date, directory, name, isDirectory, isImage, isVideo, path, type,
        });
      } catch (error) {
        //console.error(error);
      }

      listenerApi.dispatch(slices.files.actions.set(next));
    },
  },
];
