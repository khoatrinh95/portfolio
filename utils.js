import { checkFileExists } from './network.js';

async function doesFileExist(fileUrl) {
    const exists = await checkFileExists(fileUrl);
  
    if (exists) {
      return true;
    } else {
      return false;
    }
  }