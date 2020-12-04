export const messagesBuilder = {
  generalError: (details: string) => `Something went wrong! Details: ${details}`,
  incomingEvent: <T>(event: T) => `The following event was passed to lamda: ${JSON.stringify(event, null, 2)}`,
  success: () => 'Operation completed successfully!',
};
