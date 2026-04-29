import { Router } from 'express';
import config from '../../config/config';
import authRoute from './auth.route';
import docsRoute from './docs.route';
import userRoute from './user.route';

const router = Router();

interface Route {
  path: string;
  route: Router;
}

const defaultRoutes: Route[] = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
];

const devRoutes: Route[] = [
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env !== 'production') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
