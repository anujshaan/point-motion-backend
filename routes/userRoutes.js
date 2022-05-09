const router = require('express').Router();
const auth = require('../middleware/auth');
const userCtrl = require('../controllers/userCtrl')

router.get('/user/me',auth, userCtrl.getUser)


module.exports = router