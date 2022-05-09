const router = require('express').Router();
const authCtrl = require('../controllers/authCtrl');
const validData = require('../middleware/valid');

router.post('/signup',validData, authCtrl.signup);
router.post('/signin', authCtrl.signin);
router.post('/refresh_token', authCtrl.refreshToken);


module.exports = router;