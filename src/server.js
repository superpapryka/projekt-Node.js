const app = require('./app');
const { connectDB } = require('./data/connection');

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}).catch(err => {
  console.error('DB connection failed', err);
  process.exit(1);
});
