import { Router } from 'express';
import {
  createComplaint,
  getMyComplaints,
  getPublicComplaints,
  getComplaintById,
  updateComplaintStatus,
  escalateComplaint,
} from '../controllers/complaints.controller';

const router = Router();

router.post('/', createComplaint);
router.get('/my', getMyComplaints);
router.get('/public', getPublicComplaints);
router.get('/:id', getComplaintById);
router.patch('/:id/status', updateComplaintStatus);
router.post('/:id/escalate', escalateComplaint);

export default router;
