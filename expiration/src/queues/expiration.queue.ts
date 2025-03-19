import Queue, { Job } from "bull";
import { getEnv } from "../env";

const { REDIS_HOST, REDIS_PORT } = getEnv();

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("expiration", {
  redis: {
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
  },
});

expirationQueue.process(async (job: Job<Payload>) => {
  console.log("Processing job with data:", job.data);
  // Perform the job processing logic here
  // For example, you can send a notification or update the order status
  // ...
});

export { expirationQueue };
