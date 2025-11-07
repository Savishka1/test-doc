import { Router } from 'express';
import { getPendingClaims, approveClaim, rejectClaim, requestUpdate, updateQuarterlyCap } from '../controllers/hrController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { UserRole } from '../models/enums';

const router = Router();

router.use(authenticate);
router.use(authorize(UserRole.HR));

router.get('/claims/pending', getPendingClaims);
router.patch('/claims/:id/approve', approveClaim);
router.patch('/claims/:id/reject', rejectClaim);
router.patch('/claims/:id/request-update', requestUpdate);
router.patch('/settings/quarterly-cap', updateQuarterlyCap);

export default router;
