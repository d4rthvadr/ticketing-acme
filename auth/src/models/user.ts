import mongoose from 'mongoose';
import { Password } from '../utils/password';
import type { UserAttributes } from '../interfaces/user';

export interface UserDocument extends mongoose.Document, UserAttributes {}

interface UserModel extends mongoose.Model<UserDocument> {
  build(att: UserAttributes): any;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
      versionKey: false,
    },
    strict: true,
  },
);

userSchema.pre('save', async function (done) {
  if (!this.isModified('password')) {
    return;
  }

  const hashed = Password.toHash(this.get('password'));
  this.set('password', hashed);
  done();
});

userSchema.statics.build = (att: UserAttributes) => {
  return new User(att);
};

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User };
