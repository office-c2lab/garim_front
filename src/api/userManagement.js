import { apiClient } from './client.js';

export async function getRegisteredClients(params) {
  const { data } = await apiClient.get('/api/user-management/clients', {
    params,
  });

  return data;
}

export async function patchClientMetadata({ id, metadata }) {
  const { data } = await apiClient.patch(`/api/user-management/clients/${id}`, metadata);

  return data;
}
