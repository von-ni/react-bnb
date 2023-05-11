const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomType: {
    type: String,
    required: true,
  },
  prices: {
    type: [
      {
        dates: {
          year: {
            type: String,
            required: true,
          },
          month: {
            type: String,
            required: true,
          },
          date: {
            type: String,
            required: true,
          },
        },
        price: {
          type: [String],
          required: true,
        },
      },
    ],
    required: true,
    default: [],
  },
});

module.exports = Room = mongoose.model('room', RoomSchema);
