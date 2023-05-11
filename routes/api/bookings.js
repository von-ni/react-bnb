const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Booking = require('../../models/Booking');
const Room = require('../../models/Room');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

// @route GET /api/bookings/member
// @desc find bookings for a member
// @access private
router.get('/member', auth, async (req, res) => {
  try {
    const booking = await Booking.find({ 'details.member': req.id });
    if (booking.length == 0) {
      return res.status(400).json({
        errors: [{ msg: 'Currently no bookings are made.' }],
      });
    }
    res.json(booking);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('server error...');
  }
});

// @route POST /api/bookings/booking
// @desc create a booking
// @access private
router.post(
  '/booking',
  [
    auth,
    check('cardholder', 'Cardholder is required.').notEmpty({
      ignore_whitespace: true,
    }),
    check('expirationDate', 'expirationDate is required.').notEmpty(),
    check('cvc', 'Please include a valid cvc')
      .isNumeric()
      .isLength({ min: 3, max: 3 }),
    check('cardNo', 'Please enter a valid visa or mastercard No.').isCreditCard(
      { provider: 'visa' | 'mastercard' }
    ),
  ],
  async (req, res) => {
    // pass errors if fail to validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { datesDetail, roomType } = req.body;
      for (const d of datesDetail) {
        const { dates, price } = d;
        const repDates = await Booking.find({
          roomType,
          'datesDetail.dates': dates,
        }).exec();
        if (repDates.length != 0) {
          return res.status(400).json({
            errors: [{ msg: 'Dates has been reserved, please select again.' }],
          });
        }
        let repPrice = await Room.find(
          {
            roomType,
            'prices.dates': dates,
          },
          { _id: 0, 'prices.$': 1 }
        );
        repPrice = repPrice.map(doc => doc.prices[0].price.slice(-1)[0])[0];
        if (repPrice != price) {
          return res.status(400).json({
            errors: [{ msg: 'Price has been updated, please select again.' }],
          });
        }
      }
      const booking = new Booking({
        datesDetail,
        roomType,
        details: {
          member: req.id,
          ...req.body,
        },
      });
      await booking.save();
      // return token
      const payload = { id: req.id };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.EXP_TIME },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('server error...');
    }
  }
);

// @route GET /api/bookings/booking/:roomType
// @desc find all reserved dates for typed room
// @access public
router.get('/booking/:roomType', async (req, res) => {
  try {
    const { roomType } = req.params;
    let resvDates = await Booking.find({ roomType });
    resvDates = resvDates.flatMap(x => x.datesDetail.map(y => y.dates));
    res.json(resvDates);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('server error...');
  }
});
module.exports = router;
