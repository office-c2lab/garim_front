import { apiClient } from './client.js';

export async function getMonitoringEvents(params) {
  const { data } = await apiClient.get('/api/monitoring/events', {
    params,
  });

  return data;
}
