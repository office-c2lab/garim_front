import { useQuery } from '@tanstack/react-query';
import { getMonitoringEvents } from '../api/monitoring.js';

export const MONITORING_EVENTS_LIMIT = 1000;

export const monitoringQueryKeys = {
  all: ['monitoring'],
  events: params => [...monitoringQueryKeys.all, 'events', params],
};

export function getMonitoringApiStatus(statusFilter) {
  if (statusFilter === 'normal') return 'normal';
  if (statusFilter === 'block') return 'block';

  return 'all';
}

export function useMonitoringEventsQuery({ statusFilter = 'all', q = '' } = {}) {
  const apiStatus = getMonitoringApiStatus(statusFilter);
  const params = {
    limit: MONITORING_EVENTS_LIMIT,
    offset: 0,
    status: apiStatus,
    q,
  };

  return useQuery({
    queryKey: monitoringQueryKeys.events(params),
    queryFn: () => getMonitoringEvents(params),
  });
}
