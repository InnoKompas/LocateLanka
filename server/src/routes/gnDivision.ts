import { Router } from 'express';

import {
  getProvinces,
  getDistricts,
  getDSDs,
  getGNDivisions,
  getGNDivisionByCode
} from '../controllers/gnDivisionController';

import type { Router as ExpressRouter } from 'express';
const router: ExpressRouter = Router();

router.get('/provinces', getProvinces);
router.get('/districts', getDistricts);
router.get('/dsd', getDSDs);
router.get('/gn', getGNDivisions);
router.get('/gn/:gnCode', getGNDivisionByCode);

export default router;
