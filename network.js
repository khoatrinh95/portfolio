// checkFileExists.js

/**
 * Checks if a file exists on the server by sending a HEAD request.
 * @param {string} url - The URL path to the file (relative or absolute).
 * @returns {Promise<boolean>} - Resolves to true if the file exists, false otherwise.
 */
export async function checkFileExists(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Error checking file:', error);
      return false;
    }
  }
  