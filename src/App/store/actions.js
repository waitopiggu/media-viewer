import slices from './slices';

export default {
  directory: slices.directory.actions,
  files: slices.files.actions,
  image: slices.image.actions,
  mainWindow: slices.mainWindow.actions,
  media: slices.media.actions,
  thumbs: slices.thumbs.actions,
  video: slices.video.actions,
};
