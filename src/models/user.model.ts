import bcrypt from 'bcrypt';
import mongoose, { type Document, type Model } from 'mongoose';
import validator from 'validator';
import { roles } from '../config/roles';
import { paginate, toJSON } from './plugins';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
  isPasswordMatch: (password: string) => Promise<boolean>;
}

interface IUserModel extends Model<IUser> {
  isEmailTaken: (email: string, excludeUserId?: mongoose.Types.ObjectId) => Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true,
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: mongoose.Types.ObjectId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

export const User = mongoose.model<IUser, IUserModel>('User', userSchema);
