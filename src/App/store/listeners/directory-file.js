import { existsSync } from 'fs';
import db, { DIRECTORY_INDEX_NAME } from '../../shared/db';
import slices from '../slices';

export default [
  {
    actionCreator: slices.directoryFile.actions.clean,
    effect: async (action, listenerApi) => {
      const { directoryFile } = listenerApi.getState();
      const dirs = Object.keys(directoryFile);
      const next = { ...directoryFile };

      await Promise.all(dirs.map(async (dir) => {
        if (!existsSync(dir)) {
          const { store } = await db.thumbs.txn('readwrite');
          const index = store.index(DIRECTORY_INDEX_NAME);
          for await (const cursor of index.iterate(dir)) {
            cursor.delete();
            cursor.continue();
          }
          delete next[dir];
        }
        return Promise.resolve();
      }));

      listenerApi.dispatch(slices.directoryFile.actions.set(next));
    },
  },
  {
    actionCreator: slices.directoryFile.actions.navigate,
    effect: (action, listenerApi) => {
      const { directory, directoryFile, files } = listenerApi.getState();
      const dx = action.payload;
      const media = directoryFile[directory] || {};
      const index = files.findIndex((file) => file.path === media.path);
      const next = (index + (dx < 0 ? files.length : 0) + dx) % files.length;
      listenerApi.dispatch(slices.directoryFile.actions.merge({
        [directory]: files[next],
      }));
    },
  },
];
