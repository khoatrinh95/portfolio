import { checkFileExists } from './network.js';

async function doesFileExist(fileUrl) {
    try {
      const exists = await checkFileExists(fileUrl);
      return exists;
    } catch (e) {
      console.error('Error in doesFileExist:', e);
      return false;
    }
  }

export {doesFileExist};