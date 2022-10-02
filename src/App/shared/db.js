import { openDB } from 'idb/with-async-ittr';

export const DB_NAME = 'app-db';
export const THUMB_STORE_NAME = 'thumbs';
export const DIRECTORY_INDEX_NAME = 'directory';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    const thumbStore = db.createObjectStore(THUMB_STORE_NAME, { keyPath: 'path' });
    thumbStore.createIndex(DIRECTORY_INDEX_NAME, DIRECTORY_INDEX_NAME);
  },
});

export const add = async (data) => (await dbPromise).add(THUMB_STORE_NAME, data);

export const get = async (key) => (await dbPromise).get(THUMB_STORE_NAME, key);

export const txn = async (mode) => (await dbPromise).transaction(THUMB_STORE_NAME, mode);

export default { add, get, txn };
