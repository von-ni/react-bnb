const mongoose = require('mongoose');

const BookingSchema = mongoose.Schema({
  datesDetail: [
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
        type: String,
        required: true,
      },
    },
  ],
  roomType: {
    type: String,
    required: true,
  },
  details: {
    member: {
      type: mongoose.Schema.Types.ObjectID,
      ref: 'member',
      required: true,
    },
    adults: {
      type: String,
    },
    children: {
      type: String,
    },
    infant: {
      type: String,
    },
    cardNo: {
      type: String,
      required: true,
    },
    cardholder: {
      type: String,
      required: true,
    },
    expirationDate: {
      type: String,
      required: true,
    },
    cvc: {
      type: String,
      required: true,
    },
    createDate: {
      type: Date,
      default: Date.now,
    },
  },
});

module.exports = Booking = mongoose.model('booking', BookingSchema);
