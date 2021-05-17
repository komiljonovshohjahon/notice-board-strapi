module.exports = {
  settings: {
    cors: {
      enabled: true, // tried true and false
      headers: "*",
      origin: [
        "http://localhost:5500",
        "http://google.com",
        "http://localhost:1337",
        "http://127.0.0.1:5500",
      ],
    },
  },
};
