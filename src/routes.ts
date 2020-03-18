import { Router, Request, Response, NextFunction } from 'express';

/**
 * Middlewares
 */

import UploadFileMiddleware from '@middlewares/UploadFileMiddleware';
import ValidatorMiddleware from '@middlewares/ValidatorMiddleware';

/**
 * Controllers
 */

import UploadFileController from '@controllers/UploadFileController';
import ImportContactsController from '@controllers/ImportContactsController';
import ContactController from '@controllers/ContactController';
import TemplateController from '@controllers/TemplateController';
import EmailController from '@controllers/EmailController';
import EventController from '@controllers/EventController';

/**
 * Validators
 */

import UploadValidator from '@validators/UploadValidator';
import ImportContactsValidator from '@validators/ImportContactsValidator';
import TemplateControllerValidator from '@validators/TemplateControllerValidator';
import EmailControllerValidator from '@validators/EmailValidator';
import ContactControllerValidator from '@validators/ContactControllerValidator';

function wrapper(
  fn: Function,
): (req: Request, res: Response, next: NextFunction) => void {
  const wrapperFn = (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
  return wrapperFn;
}

const routes = Router();

routes.post(
  '/upload/:type',
  ValidatorMiddleware(UploadValidator),
  UploadFileMiddleware.single('file'),
  wrapper(UploadFileController.store),
);

routes.post(
  '/contacts/import',
  ValidatorMiddleware(ImportContactsValidator.store),
  wrapper(ImportContactsController.store),
);

routes.get('/contacts', wrapper(ContactController.index));
routes.get('/contacts/:id', wrapper(ContactController.show));

routes.post(
  '/contacts',
  ValidatorMiddleware(ContactControllerValidator.store),
  wrapper(ContactController.store),
);

routes.post(
  '/templates',
  ValidatorMiddleware(TemplateControllerValidator.store),
  wrapper(TemplateController.store),
);

routes.get('/templates', wrapper(TemplateController.index));

routes.get(
  '/templates/:id',
  ValidatorMiddleware(TemplateControllerValidator.show),
  wrapper(TemplateController.show),
);

routes.post(
  '/emails',
  ValidatorMiddleware(EmailControllerValidator.store),
  wrapper(EmailController.store),
);

routes.get('/emails/', wrapper(EmailController.index));

routes.get(
  '/emails/:id',
  ValidatorMiddleware(EmailControllerValidator.show),
  wrapper(EmailController.show),
);

routes.get('/emails/:emailId/events', wrapper(EventController.index));
routes.get('/emails/:emailId/events/:id', wrapper(EventController.show));

export default routes;
