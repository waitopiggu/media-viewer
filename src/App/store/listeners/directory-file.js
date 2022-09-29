import slices from '../slices';

export default [
  {
    actionCreator: slices.directoryFile.actions.navigate,
    effect: (action, listenerApi) => {
      const { directory, directoryFile, files } = listenerApi.getState();
      const dx = action.payload;
      console.log(dx)
      const media = directoryFile[directory] || {};
      const index = files.findIndex((file) => file.path === media.path);
      const next = (index + (dx < 0 ? files.length : 0) + dx) % files.length;
      listenerApi.dispatch(slices.directoryFile.actions.merge({
        [directory]: files[next],
      }));
    },
  },
];
