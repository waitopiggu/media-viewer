import childProcess from 'child_process';
import natsort from 'natsort';
import path from 'path';
import db from './db';

/**
 * Format bytes to string
 * https://stackoverflow.com/a/18650828
 * @param {number} bytes
 * @param {number} decimals
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Get Image/Video thumb from db (or create and get)
 * @param {any} file
 */
export const getMediaThumb = async (file) => {
  const thumb = await db.thumbs.get(file.path);
  if (thumb) {
    if (thumb.fileSize === file.size) return thumb;
    await db.thumbs.del(file.path);
  }

  let mediaEl = null;
  let mediaWidth = 0;
  let mediaHeight = 0;

  if (file.isImage) {
    mediaEl = document.createElement('img');
    await new Promise((resolve) => {
      mediaEl.addEventListener('load', resolve);
      mediaEl.src = file.path;
    });
    mediaWidth = mediaEl.width;
    mediaHeight = mediaEl.height;
  } else {
    mediaEl = document.createElement('video');
    await new Promise((resolve) => {
      mediaEl.addEventListener('loadeddata', resolve);
      mediaEl.src = file.path;
    });
    await new Promise((resolve) => {
      mediaEl.addEventListener('seeked', resolve);
      mediaEl.currentTime = 0.0;
    });
    mediaWidth = mediaEl.videoWidth;
    mediaHeight = mediaEl.videoHeight;
  }

  const size = 48;
  const ratio = mediaWidth / mediaHeight;
  let width = size;
  let height = size / ratio;
  if (height > size) {
    height = size;
    width = height * ratio;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(mediaEl, 0, 0, width, height);

  try {
    await db.thumbs.add({
      dataUrl: canvas.toDataURL('image/jpeg', 0.8),
      directory: file.directory,
      fileSize: file.size,
      path: file.path,
    }, 'thumbs');
  } catch (error) {
    console.error(error, file.directory, file.path);
  }

  return db.thumbs.get(file.path);
};

/**
 * Get POSIX path on any platform
 * @param {string} pathValue
 */
export const getPosixPath = (pathValue) => (
  pathValue.split(path.sep).join(path.posix.sep)
);

/**
 * Natural Sort-by
 * @param {string} value
 */
export const naturalSortBy = (value, desc = false) => {
  const sorter = natsort({ desc, insensitive: true });
  return (a, b) => sorter(a[value], b[value]);
};

export default {
  formatBytes,
  getMediaThumb,
  getPosixPath,
  naturalSortBy,
};
