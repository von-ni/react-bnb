const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Member = require('../../models/Member');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @route POST /api/auth/member
// @desc authenticate member & obtain token
// @access public
router.post(
  '/member',
  [
    // check validation of req.body
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required.').exists(),
  ],
  async (req, res) => {
    //console.log(req.body);
    // pass errors if fail to validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      // check if member exists
      let member = await Member.findOne({ email });
      if (!member) {
        return res.status(400).json({
          errors: [{ msg: 'Invalid email or password. Please try again.' }],
        });
      }
      // check if password corrects
      const isMatch = await bcrypt.compare(password, member.password);
      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: 'Invalid email or password. Please try again.' }],
        });
      }
      // return token
      const payload = { id: member.id };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
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

module.exports = router;
