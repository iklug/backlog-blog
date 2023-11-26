const {Router} = require('express');

const router = Router();

//i need to figure out this routing?
//am i supposed to access the database in here?

router.get('/', (req,res)=>{
    return res.send(req.context.data.currentUser);
});

router.get('/:userId', (req,res)=>{
    return res.send(req.context.data.users[req.params.userId]);
});

module.exports = router;