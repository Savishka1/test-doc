import { Router } from 'express';
import { getApprovedClaims, markAsPaid, exportPayments } from '../controllers/accountsController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { UserRole } from '../models/enums';

const router = Router();

router.use(authenticate);
router.use(authorize(UserRole.ACCOUNTS));

router.get('/claims/approved', getApprovedClaims);
router.patch('/claims/:id/pay', markAsPaid);
router.get('/export/:format', exportPayments);

export default router;
