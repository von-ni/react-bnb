const express = require('express');
const router = express.Router();
const Room = require('../../models/Room');
const dayjs = require('dayjs');

// @route GET api/rooms/price/search?roomType=xxx&start=YYYY-MM-DD&end=YYYY-MM-DD
// @desc get price per roomType during [star,end]
// @access public
router.get('/price/search', async (req, res) => {
  try {
    const { roomType, start, end } = req.query;
    const prices = await Room.aggregate([
      { $match: { roomType } },
      {
        $project: {
          _id: 0,
          prices: {
            $map: {
              input: {
                $filter: {
                  input: '$prices',
                  cond: {
                    $and: [
                      {
                        $gte: [
                          {
                            $dateFromParts: {
                              year: { $toInt: '$$this.dates.year' },
                              month: {
                                $subtract: [
                                  { $toInt: '$$this.dates.month' },
                                  1,
                                ],
                              },
                              day: { $toInt: '$$this.dates.date' },
                            },
                          },
                          new Date(start),
                        ],
                      },
                      {
                        $lte: [
                          {
                            $dateFromParts: {
                              year: { $toInt: '$$this.dates.year' },
                              month: {
                                $subtract: [
                                  { $toInt: '$$this.dates.month' },
                                  1,
                                ],
                              },
                              day: { $toInt: '$$this.dates.date' },
                            },
                          },
                          new Date(end),
                        ],
                      },
                    ],
                  },
                },
              },
              as: 'prices',
              in: {
                dates: '$$prices.dates',
                price: { $last: '$$prices.price' },
              },
            },
          },
        },
      },
    ]);
    res.json(prices);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('server error...');
  }
});

// @route POST api/rooms/price
// @desc set price
// @access private
router.post('/price', async (req, res) => {
  try {
    const { roomType, dates, price } = req.body;
    await Room.updateOne(
      {
        roomType,
        prices: { $not: { $elemMatch: { dates } } },
      },
      { $addToSet: { prices: { dates, price: [price] } } }
    );
    res.send();
  } catch (err) {
    console.log(err.message);
    res.status(500).send('server error...');
  }
});

// @route POST api/rooms/prices
// @desc set price for [datesStart, datesEnd]
// @access private
router.post('/prices', async (req, res) => {
  try {
    const { roomType, datesStart, datesEnd, price } = req.body;
    const limitDate = dayjs(Object.values(datesEnd).join('-')).add(1, 'day');
    let curDate = dayjs(Object.values(datesStart).join('-'));
    while (!curDate.isSame(limitDate, 'day')) {
      const df = curDate.format('YYYY-MM-DD').split('-');
      const dates = { year: df[0], month: df[1], date: df[2] };
      //console.log(dates);
      await Room.updateOne(
        {
          roomType,
          prices: { $not: { $elemMatch: { dates: dates } } },
        },
        { $addToSet: { prices: { dates: dates, price: [price] } } }
      );
      curDate = curDate.add(1, 'day');
    }
    res.send();
  } catch (err) {
    console.log(err.message);
    res.status(500).send('server error...');
  }
});

// @route PUT api/rooms/price
// @desc update price
// @access private
router.put('/price', async (req, res) => {
  try {
    const { roomType, dates, price } = req.body;
    // const result = await Room.find({
    //   roomType,
    //   'prices.dates': dates,
    // });
    // console.log(result);
    const result = await Room.updateOne(
      { roomType, prices: { $elemMatch: { dates } } },
      { $push: { 'prices.$.price': price } }
    );
    // console.log(result);
    if (result.modifiedCount == 0) {
      return res.status(400).json({
        errors: [{ msg: 'Please set price first.' }],
      });
    }
    res.send();
  } catch (err) {
    console.log(err.message);
    res.status(500).send('server error...');
  }
});

module.exports = router;
