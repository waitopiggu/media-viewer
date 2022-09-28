import { filter } from 'lodash';
import { util } from '../../shared';
import slices from '../slices';

export default [
  {
    actionCreator: slices.files.actions.set,
    effect: async (action, listenerApi) => {
      const files = filter(action.payload, 'isVideo');
      const next = {};

      await Promise.all(files.map(async (file) => {
        const thumb = await util.getVideoThumb(file.directory, file.path);
        next[thumb.path] = thumb.dataUrl;
        return Promise.resolve();
      }));

      listenerApi.dispatch(slices.thumbs.actions.set(next));
    },
  },
];
