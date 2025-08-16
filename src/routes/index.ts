import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.json({
        message: 'Hello from index route!',
        query: req.query
    });
})

export default router; 