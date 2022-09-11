import { filter } from 'lodash';
import { db, util } from '../../shared/lib';
import slices from '../slices';

export default [
  {
    actionCreator: slices.files.actions.set,
    effect: async (action, listenerApi) => {
      const nextThumbs = {};

      for (let file of filter(action.payload, 'isVideo')) {
        const thumb = await util.getVideoThumb(file.directory, file.path);
        nextThumbs[thumb.path] = thumb.dataUrl;
      }

      listenerApi.dispatch(slices.thumbs.actions.set(nextThumbs));
    },
  },
];
