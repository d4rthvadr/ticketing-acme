const natsWrapper = {
  getClient: () => {
    return {
      publish: jest
        .fn()
        .mockImplementation(
          (subject: string, data: string, callback: () => void) => {
            callback();
          }
        ),
    };
  },
};

export default natsWrapper;
