import Queue, { Job } from "bull";
import { getEnv } from "../env";
import { orderService } from "../domain/services/order.service";

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

  const { orderId } = job.data;

  await orderService.expiredOrder(orderId);
  console.log(`Order with ID ${orderId} has expired`);
});

export { expirationQueue };
