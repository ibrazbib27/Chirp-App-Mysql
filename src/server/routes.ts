import * as express from 'express';
import myChirpRoutes from './routes/chrips';
import allMyChirps from "./routes/allchirps";
let router = express.Router();

router.use('/getall', allMyChirps);
router.use('/api', myChirpRoutes);

export default router;