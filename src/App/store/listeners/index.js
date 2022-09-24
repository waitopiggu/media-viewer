import filesListeners from './files';
import mediaListeners from './media';
import thumbsListeners from './thumbs';

export default [
  ...filesListeners,
  ...mediaListeners,
  ...thumbsListeners,
];
