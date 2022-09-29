import directoryFileListeners from './directory-file';
import filesListeners from './files';
import thumbsListeners from './thumbs';

export default [
  ...directoryFileListeners,
  ...filesListeners,
  ...thumbsListeners,
];
