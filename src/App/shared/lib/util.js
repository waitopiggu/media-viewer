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
 * @param {string} filePath
 */
export const getVideoThumb = async (directory, filePath) => {
  const thumb = await db.get(filePath);
  if (thumb) return thumb;

  const video = document.createElement('video');
  await new Promise((resolve) => {
    video.addEventListener('loadeddata', resolve);
    video.src = filePath;
  });
  await new Promise((resolve) => {
    video.addEventListener('seeked', resolve);
    video.currentTime = 0.0;
  });

  const { videoWidth, videoHeight } = video;
  const size = 96;
  const ratio = videoWidth / videoHeight;
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
  await db.add({ dataUrl, directory, path: filePath }, 'thumbs');

  return db.get(filePath);
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
      const lines = stdout.split('\r\r\n').map((line) => line.trim());
      const drives = lines.filter((value) => /[A-Za-z]:/.test(value));
      resolve(drives);
    }
  });
});

export default { getPosixPath, getVideoThumb, listWindowsDrives };
