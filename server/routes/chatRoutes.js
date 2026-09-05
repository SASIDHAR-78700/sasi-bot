const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const {
  sendMessage,
  generateImage,
  getHistory,
  getConversation,
  deleteConversation,
} = require('../controllers/chatController');

// All chat routes require authentication
router.use(authenticate);

router.post('/send', sendMessage);
router.post('/generate-image', generateImage);
router.get('/history', getHistory);
router.get('/:id', getConversation);
router.delete('/:id', deleteConversation);

module.exports = router;
