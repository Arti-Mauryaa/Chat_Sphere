const Message = require("../models/messageModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Message.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      // If the difference between updatedAt and createdAt is more than 1 second, it's edited
      const isEdited = msg.updatedAt && msg.createdAt && (new Date(msg.updatedAt) - new Date(msg.createdAt) > 1000);
      return {
        _id: msg._id,
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        isEdited: isEdited,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
      };
    });

    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;

    const data = await Message.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) {
      return res.json({
        status: true,
        msg: "Message added successfully.",
        message: {
          _id: data._id,
          fromSelf: true,
          message: data.message.text,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }
      });
    } else {
      return res.json({ status: false, msg: "Failed to add message to the database" });
    }
  } catch (ex) {
    next(ex);
  }
};

module.exports.editMessage = async (req, res, next) => {
  try {
    const { messageId, newMessage } = req.body;

    const updatedMsg = await Message.findByIdAndUpdate(
      messageId,
      {
        "message.text": newMessage,
      },
      { new: true }
    );

    if (updatedMsg) {
      return res.json({
        status: true,
        msg: "Message edited successfully.",
        message: {
          _id: updatedMsg._id,
          message: updatedMsg.message.text,
          isEdited: true,
          updatedAt: updatedMsg.updatedAt,
        }
      });
    } else {
      return res.json({ status: false, msg: "Failed to edit message in database." });
    }
  } catch (ex) {
    next(ex);
  }
};