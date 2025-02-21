import { randomBytes } from "crypto";

export const genID = (prefix: string = "") => {
  const id = `${randomBytes(4).toString("hex")}:${new Date().toISOString()}`;
  return prefix.length ? `${prefix}_${id}` : id;
};
