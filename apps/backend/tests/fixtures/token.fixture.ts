import moment from 'moment';
import config from '../../src/config/config';
import { tokenTypes } from '../../src/config/tokens';
import { tokenService } from '../../src/services/token.service';
import { admin, userOne } from './user.fixture';

const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
const userOneAccessToken = tokenService.generateToken(userOne.id, accessTokenExpires, tokenTypes.ACCESS);
const adminAccessToken = tokenService.generateToken(admin.id, accessTokenExpires, tokenTypes.ACCESS);

export { adminAccessToken, userOneAccessToken };
