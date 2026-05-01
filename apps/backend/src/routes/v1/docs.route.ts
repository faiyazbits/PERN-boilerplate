import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import httpStatus from 'http-status';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import config from '../../config/config';
import swaggerDefinition from '../../docs/swaggerDef';

const router = Router();

const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: ['src/docs/*.yml', 'src/routes/v1/*.ts'],
});

const productionGuard = (_req: Request, res: Response, next: NextFunction) => {
  if (config.env === 'production') {
    res.sendStatus(httpStatus.NOT_FOUND);
    return;
  }
  next();
};

router.use('/', productionGuard, swaggerUi.serve);
router.get(
  '/',
  productionGuard,
  swaggerUi.setup(specs, {
    explorer: true,
  })
);

export default router;
