const path = require('path');
const dotenv = require('dotenv');

// Load env from correct path
const envPath = path.resolve(__dirname, '../.env');
console.log('Trying to load .env from:', envPath);

dotenv.config({ path: envPath });

console.log('Loaded MONGO_URI:', process.env.MONGO_URI);

const connectDB = require('./config/db');
const app = require('./app');

connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
