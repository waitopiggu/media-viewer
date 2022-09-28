import { filter } from 'lodash';
import { util } from '../../shared';
import slices from '../slices';

export default [
  {
    actionCreator: slices.files.actions.set,
    effect: async (action, listenerApi) => {
      const next = {};
      const images = filter(action.payload, 'isImage');
      const videos = filter(action.payload, 'isVideo');

      await Promise.all(images.map(async (file) => {
        const thumb = await util.getImageThumb(file.directory, file.path);
        next[thumb.path] = thumb.dataUrl;
        return Promise.resolve();
      }));

      await Promise.all(videos.map(async (file) => {
        const thumb = await util.getVideoThumb(file.directory, file.path);
        next[thumb.path] = thumb.dataUrl;
        return Promise.resolve();
      }));

      listenerApi.dispatch(slices.thumbs.actions.set(next));
    },
  },
];
