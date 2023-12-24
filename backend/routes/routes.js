// routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    signUp,
    logIn,
    changeUsername,
    changePassword,
    changePhoto,
    getOrders,
    createOrder,
    updateOrder,
    removeOrder
} = require('../controllers/controller');

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.post('/signup', signUp);
router.post('/login', logIn);
router.post('/change-username', changeUsername);
router.post('/change-password', changePassword);
router.post('/change-photo', upload.single('file'), changePhoto);

router.get('/get-orders', getOrders);
router.post('/create-order', createOrder);
router.patch('/update-order/:id', updateOrder);
router.delete('/remove-order/:id', removeOrder);

module.exports = router;
