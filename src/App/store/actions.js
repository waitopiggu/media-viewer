import slices from './slices';

export default {
  app: slices.app.actions,
  directory: slices.directory.actions,
  directoryFile: slices.directoryFile.actions,
  files: slices.files.actions,
  image: slices.image.actions,
  video: slices.video.actions,
};
