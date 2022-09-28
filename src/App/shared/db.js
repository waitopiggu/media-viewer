import { openDB } from 'idb';

export const DB_NAME = 'app-db';
const THUMB_STORE_NAME = 'thumbs';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    const thumbStore = db.createObjectStore(THUMB_STORE_NAME, { keyPath: 'path' });
    thumbStore.createIndex('directory', 'directory');
  },
});

export const add = async (data) => (await dbPromise).add(THUMB_STORE_NAME, data);

export const get = async (key) => (await dbPromise).get(THUMB_STORE_NAME, key);

export default { add, get };
