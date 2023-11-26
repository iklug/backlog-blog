const {Router} = require('express');

const router = Router();

router.get('/', (req,res)=>{
    return res.send(req.context.data.currentUser);
});

router.get('/:userId', (req,res)=>{
    return res.send(req.context.data.users[req.params.userId]);
});

module.exports = router;