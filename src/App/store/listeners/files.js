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

        const contentType = mime.lookup(path);
        const index = next.length;

        const isDirectory = !stats.isFile();
        const isImage = /image\/*/.test(contentType);
        const isVideo = /video\/*/.test(contentType);

        (isDirectory || isImage || isVideo) && next.push({
          directory, name, index, isDirectory, isImage, isVideo, path,
        });
      } catch (error) {
        //console.error(error);
      }

      listenerApi.dispatch(slices.files.actions.set(next));
    },
  },
];
