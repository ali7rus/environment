const http = require('./index');
const PORT = process.env.PORT || 3001;

http.listen(PORT, "localhost", () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);