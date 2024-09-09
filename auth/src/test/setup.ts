import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({});
  const mongoUri = mongoServer.getUri();
  await mongoose
    .connect(mongoUri, {})
    .then(() => {
      console.log('Mongodb connection established');
    })
    .catch((err) => {
      console.log('Failed to connect to mongodb', err);
      process.exit(-1);
    });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  collections.map(async (collection) => await collection.deleteMany({}));
});

afterAll(async () => {
  if (mongoServer) {
    await mongoServer.stop();
  }
  await mongoose.connection.close();
});
