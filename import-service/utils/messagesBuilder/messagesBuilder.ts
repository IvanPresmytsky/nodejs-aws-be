export const messagesBuilder = {
  importProductFile: {
    badRequest: () => 'Bad request! "name" query parameter should be provided!',
    success: (url: string) => `The folowing signed url successully created: ${url}`,
    generalError: (err: Error) => `Something went wrong! Details: ${JSON.stringify(err, null, 2)}`,
  },
};
