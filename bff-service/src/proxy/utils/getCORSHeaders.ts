const CORS_HEADERS = ['authorization'];

const getCORSHeaders = (headers = {}) => 
  Object.keys(headers).reduce((acc, headerKey) => {
    if (CORS_HEADERS.includes(headerKey)) {
      acc[headerKey] = headers[headerKey];
    }
    return acc;
  }, {});

export default getCORSHeaders;
