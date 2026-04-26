import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { User } from '../models';
import config from './config';
import { tokenTypes } from './tokens';

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (
  payload: { sub: string; type: string },
  done: (error: Error | null, user?: false | null | any) => void
) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error as Error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export { jwtStrategy };
