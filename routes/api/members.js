const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Member = require('../../models/Member');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

// @route GET /api/members
// @desc find all members
// @access private
router.get('/');

// @route DELETE /api/members
// @desc delete all members
// @access

// @route GET /api/members/member
// @desc find a member
// @access private
router.get('/member', auth, async (req, res) => {
  try {
    const member = await Member.findById(req.id).select('-password');
    //console.log(member);
    res.json(member);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error...');
  }
});

// @route POST api/members/memebr
// @desc register a member
// @access public
router.post(
  '/member',
  [
    // check validation of req.body
    check('name.firstName', 'First name is required.').notEmpty({
      ignore_whitespace: true,
    }),
    check('name.lastName', 'Last name is required.').notEmpty({
      ignore_whitespace: true,
    }),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 8 or more characters and contains minimum 1 uppercase,lowercase and number.'
    ).isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    }),
  ],
  async (req, res) => {
    // pass errors if fail to validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      // check if member exists
      let member = await Member.findOne({ email });
      if (member) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists. Please login.' }] });
      }
      // new a Member instance
      member = new Member({
        name,
        email,
        password,
      });
      // encrpt password
      const salt = await bcrypt.genSalt(10);
      member.password = await bcrypt.hash(password, salt);
      // register
      await member.save();
      // return token
      const payload = { id: member.id };
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

// @route PUT /api/members/member
// @desc update a member
// @access private
router.put(
  '/member',
  [
    auth,
    [
      // check validation of req.body
      check('name.firstName', 'First name is required.').notEmpty({
        ignore_whitespace: true,
      }),
      check('name.lastName', 'Last name is required.').notEmpty({
        ignore_whitespace: true,
      }),
      check('email', 'Please include a valid email').isEmail(),
      check('oldPassword', 'Old Password is required.').exists(),
      check(
        'password',
        'Please enter a password with 8 or more characters and contains minimum 1 uppercase,lowercase and number.'
      ).isStrongPassword({
        minLength: 8,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      }),
    ],
  ],
  async (req, res) => {
    // pass errors if fail to validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // check old password if match
      const member = await Member.findById(req.id);
      const isMatch = await bcrypt.compare(
        req.body.oldPassword,
        member.password
      );
      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: 'Incorrect old password. Please try again.' }],
        });
      }
      // encrpt new password
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);

      await Member.findOneAndUpdate(
        { _id: req.id },
        { ...req.body },
        { new: true }
      );
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

// @route DELETE /api/members/member
// @desc delete a member
// @access private

module.exports = router;
