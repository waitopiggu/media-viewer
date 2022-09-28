import { util } from '../../shared';
import slices from '../slices';

export default [
  {
    actionCreator: slices.files.actions.set,
    effect: async (action, listenerApi) => {
      const media = action.payload.filter((file) => file.isImage || file.isVideo);
      const next = {};

      await Promise.all(media.map(async (file) => {
        const thumb = await util.getMediaThumb(file);
        next[thumb.path] = thumb.dataUrl;
        return Promise.resolve();
      }));

      listenerApi.dispatch(slices.thumbs.actions.set(next));
    },
  },
];
