import mongoose, { type Document, type Model } from 'mongoose';
import { TokenType } from '../config/tokens';
import { toJSON } from './plugins';

export interface IToken extends Document {
  token: string;
  user: mongoose.Types.ObjectId;
  type: TokenType;
  expires: Date;
  blacklisted: boolean;
}

interface ITokenModel extends Model<IToken> {}

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [TokenType.REFRESH, TokenType.RESET_PASSWORD, TokenType.VERIFY_EMAIL],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

tokenSchema.plugin(toJSON);

export const Token = mongoose.model<IToken, ITokenModel>('Token', tokenSchema);
