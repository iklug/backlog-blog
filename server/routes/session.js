const {Router} = require('express');

const router = Router();

router.get('/', (req,res)=>{
    return res.send('tom');
});

module.exports = router;