export const getServiceUrl = (url: string): string | undefined  => {
  console.log('url', url);
  const serviceName = url.split('/')[1];
  return process.env[serviceName];
}
