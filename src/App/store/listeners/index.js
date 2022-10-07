import directoryFileListeners from './directory-file';
import filesListeners from './files';

export default [
  ...directoryFileListeners,
  ...filesListeners,
];
