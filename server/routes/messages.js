const { addMessage, getMessages, editMessage } = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.post("/editmsg/", editMessage);

module.exports = router;
