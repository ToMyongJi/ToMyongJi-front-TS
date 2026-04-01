export const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE === 'true';

export const maintenanceCopy = {
  date: import.meta.env.VITE_MAINTENANCE_DATE ?? '0월 00일 00:00 ~ 0월 00일 00:00',
  description: import.meta.env.VITE_MAINTENANCE_DESCRIPTION ?? '서버 성능 개선 및 안정화',
};
