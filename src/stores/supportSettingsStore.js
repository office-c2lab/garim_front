import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import logoIcon from '../assets/icons/logo.png';

export const DEFAULT_DOWNLOAD_PATH = '/download';

export const reservedDownloadPaths = [
  '/',
  '/dashboard',
  '/monitoring',
  '/users',
  '/policies',
  '/domains',
  '/support',
];

export const defaultSupportTemplate = {
  logoSrc: logoIcon,
  companyName: 'GARIM Co., Ltd.',
  companyDescription: 'GARIM은 안전하고 효율적인 IT 환경을 제공하는 기술 기업입니다.',
  adminEmail: 'support@garim.com',
  adminPhone: '02-1234-5678',
};

export function normalizeDownloadPath(path) {
  const trimmedPath = path.trim();
  if (!trimmedPath) return DEFAULT_DOWNLOAD_PATH;
  const withSlash = trimmedPath.startsWith('/') ? trimmedPath : `/${trimmedPath}`;
  return withSlash.replace(/\/+$/, '') || DEFAULT_DOWNLOAD_PATH;
}

function parseLegacyAdminContact(adminContact = '') {
  const [email = defaultSupportTemplate.adminEmail, phone = defaultSupportTemplate.adminPhone] =
    adminContact
      .split('/')
      .map(value => value.trim())
      .filter(Boolean);

  return { email, phone };
}

export function normalizeSupportTemplate(template = {}) {
  const legacyContact = parseLegacyAdminContact(template.adminContact);

  return {
    ...defaultSupportTemplate,
    ...template,
    adminEmail: template.adminEmail || legacyContact.email,
    adminPhone: template.adminPhone || legacyContact.phone,
  };
}

export const useSupportSettingsStore = create(
  persist(
    set => ({
      template: defaultSupportTemplate,
      downloadPath: DEFAULT_DOWNLOAD_PATH,

      setTemplate: template => set({ template: normalizeSupportTemplate(template) }),
      setDownloadPath: downloadPath => set({ downloadPath: normalizeDownloadPath(downloadPath) }),
    }),
    {
      name: 'garim-support-settings',
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        template: normalizeSupportTemplate(persistedState?.template),
        downloadPath: normalizeDownloadPath(
          persistedState?.downloadPath || currentState.downloadPath
        ),
      }),
    }
  )
);
