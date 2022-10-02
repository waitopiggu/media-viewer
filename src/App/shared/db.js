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

export default {
  thumbs: {
    /**
     * DB thumbs add
     * @param {any} data
     */
    add: async (data) => (await dbPromise).add(THUMB_STORE_NAME, data),
    /**
     * DB thumbs get
     * @param {string} key - file path
     */
    get: async (key) => (await dbPromise).get(THUMB_STORE_NAME, key),
    /**
     * DB thumbs transaction
     * @param {string} mode - readonly | readwrite
     */
    txn: async (mode) => (await dbPromise).transaction(THUMB_STORE_NAME, mode),
  },
};
