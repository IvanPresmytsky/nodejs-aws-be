import { getServiceName } from '../getServiceName';

export const getServiceUrl = (url: string): string | undefined  => {
  const serviceName = getServiceName(url);
  return process.env[serviceName];
}
