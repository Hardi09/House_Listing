const mongoose = require('../util/database');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  userID: String,
  username: String,
  email: String,
  password: String,
  contactNumber: String 
}, { strict: true });

//function for storing password in encyrpted format
  userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

const SignUpIn = mongoose.model('SignUpIn', userSchema);

module.exports = SignUpIn;
