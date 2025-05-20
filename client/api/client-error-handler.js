const errorHandler = (callback) => {
  try {
    callback();
  } catch (error) {
    console.error("Error:", error);
    // Handle the error as needed
  }
};
