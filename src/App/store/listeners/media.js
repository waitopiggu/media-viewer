import slices from '../slices';

export default [
  {
    actionCreator: slices.media.actions.navigate,
    effect: async (action, listenerApi) => {
      const dir = action.payload;
      const { files, media } = listenerApi.getState();
      const index = files.findIndex((file) => media && file.name === media.name);
      const next = (index + (dir < 0 ? files.length - 1 : 1)) % files.length;
      listenerApi.dispatch(slices.media.actions.set(files[next]));
    },
  },
];
