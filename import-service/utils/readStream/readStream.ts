export const readStream = (stream, parser): Promise<any> => 
  new Promise((resolve, reject) => {
    const result = [];

    stream
      .pipe(parser())
      .on('data', (data) => result.push(data))
      .on('error', (error) => reject(error))
      .on('end', () => resolve(result)); 
  });
