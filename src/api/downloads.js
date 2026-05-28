import { apiClient } from './client.js';

export const WINDOWS_SETUP_ZIP_FILENAME = 'garim-windows-setup.zip';

export async function downloadWindowsSetupZip() {
  const { data } = await apiClient.get(`/downloads/windows/${WINDOWS_SETUP_ZIP_FILENAME}`, {
    responseType: 'blob',
  });

  return data;
}
