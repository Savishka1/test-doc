import { Router } from 'express';
import { submitClaim, getClaims, getClaim, updateClaim, getBalance } from '../controllers/claimController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/fileValidator';
import { UserRole } from '../models/enums';

const router = Router();

router.use(authenticate);
router.use(authorize(UserRole.EMPLOYEE));

router.post('/', upload.fields([{ name: 'bill', maxCount: 1 }, { name: 'prescription', maxCount: 1 }]), submitClaim);
router.get('/', getClaims);
router.get('/balance', getBalance);
router.get('/:id', getClaim);
router.put('/:id', updateClaim);

export default router;
