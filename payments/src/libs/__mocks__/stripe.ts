// export const stripe = {
//   charges: {
//     create: jest.fn().mockResolvedValue({}),
//   },
// };

export class Stripe {
  charges = {
    create: jest.fn().mockResolvedValue({}),
  };
}

export const stripe = new Stripe();
