import childProcess from 'child_process';
import path from 'path';
import db from './db';

/**
 * Get POSIX path on any platform
 * @param {string} pathValue
 */
export const getPosixPath = (pathValue) => (
  pathValue.split(path.sep).join(path.posix.sep)
);

/**
 * Get video thumb from db (or create and get)
 * @param {string} directory
 * @param {string} path
 */
export const getVideoThumb = async (directory, path) => {
  const thumb = await db.get(path);
  if (thumb) return thumb;

  const video = document.createElement('video');
  await new Promise((resolve) => {
    video.addEventListener('loadeddata', resolve);
    video.src = path;
  });
  await new Promise((resolve) => {
    video.addEventListener('seeked', resolve);
    video.currentTime = 0.0;
  });

  const ratio = video.videoWidth / video.videoHeight;
  const size = 96;
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
  ctx.drawImage(video, 0, 0, width, height);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
  await db.add({ dataUrl, directory, path }, 'thumbs');

  return await db.get(path);
};

/**
 * List Windows drives
 * Adapted from https://stackoverflow.com/a/52411712
 */
export const listWindowsDrives = () => new Promise((resolve, reject) => {
  childProcess.exec('wmic logicaldisk get name', (error, stdout) => {
    if (error) {
      reject(error);
    } else {
      resolve(stdout
        .split('\r\r\n')
        .filter((value) => /[A-Za-z]:/.test(value))
        .map((value) => value.trim())
      );
    }
  });
});

export default { getPosixPath, getVideoThumb, listWindowsDrives };
