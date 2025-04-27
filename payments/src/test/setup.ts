import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { signJwtToken } from "@vtex-tickets/common";
import { randomBytes } from "crypto";

jest.mock("../libs/nats-wrapper", () => {
  return {
    __esModule: true,
    default: {
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
    },
  };
});

jest.mock("../libs/stripe");

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: {
      version: "4.4.10", // Use MongoDB 4.4 to avoid AVX issues
    },
  });
  const mongoUri = mongoServer.getUri();
  await mongoose
    .connect(mongoUri, {})
    .then(() => {
      console.log("Mongodb connection established");
    })
    .catch((err) => {
      console.log("Failed to connect to mongodb", err);
      process.exit(-1);
    });
});

beforeEach(async () => {
  // jest.clearAllMocks();

  const collections = mongoose.connection.db
    ? await mongoose.connection.db.collections()
    : [];

  collections.map(async (collection) => await collection.deleteMany({}));
});

afterAll(async () => {
  if (mongoServer) {
    await mongoServer.stop();
  }
  await mongoose.connection.close();
});

global.signin = (userId: string | undefined) => {
  const payload = {
    id: userId ?? randomBytes(6).toString("hex"),
    email: "email@example.com",
  };

  const session = { jwt: signJwtToken(payload, process.env.JWT_SECRET!) };

  const base64Format = Buffer.from(JSON.stringify(session)).toString("base64");
  return [`session=${base64Format}`];
};
