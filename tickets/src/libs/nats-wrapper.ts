import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private static _client?: Stan;

  // Private constructor to prevent accidental instantiation
  private constructor() {}

  static getClient(): Stan {

    return NatsWrapper._client;
  }

  static async disconnect() {
    if (NatsWrapper._client) {
      NatsWrapper._client.close();
    }
    console.log("NATS client closed");
  }

  static async connect(
    clusterId: string,
    clientId: string,
    url: string
  ): Promise<void> {
    if (NatsWrapper._client) {
      console.log("Already connected to NATS");
      return;
    }
    this._client = nats.connect(clusterId, clientId, {
      url,
      reconnect: true,
      maxReconnectAttempts: 20,
      reconnectTimeWait: 10 * 1000,
      verbose: true, // TODO: Can be driven by environment mode (development/production)
    });

    return new Promise<void>((resolve, reject) => {
      this._client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });

      this._client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export default NatsWrapper;
