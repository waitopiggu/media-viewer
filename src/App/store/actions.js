import slices from './slices';

export default {
  app: slices.app.actions,
  directory: slices.directory.actions,
  files: slices.files.actions,
  image: slices.image.actions,
  media: slices.media.actions,
  thumbs: slices.thumbs.actions,
  video: slices.video.actions,
};
