// const crypto = require("crypto");
// const moment = require("moment-timezone");
// const User = require("../../v1/repositories/admin/User");
// const RestApisHelper = require("../helpers/RestApisHelper");

// module.exports.generatePassword = function (length = 8) {
//   var charset =
//       "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", //dummy string
//     retVal = "";
//   for (var i = 0, n = charset.length; i < length; ++i) {
//     retVal += charset.charAt(Math.floor(Math.random() * n));
//   }
//   return retVal;
// };

// module.exports.generateCode = function (length = 6) {
//   var self = this;
//   var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", // dummy string
//     retVal = "";
//   for (var i = 0, n = charset.length; i < length; ++i) {
//     retVal += charset.charAt(Math.floor(Math.random() * n));
//   }
//   return retVal;
// };

// module.exports.generatePinCode = function () {
//   /* for 6 digits */
//   var retVal = Math.floor(100000 + Math.random() * 900000);
//   return retVal;
// };

// module.exports.generatePasscode = function () {
//   /* for 6 digits */
//   var self = this;
//   return new Promise(async function (resolve, reject) {
//     retVal = Math.floor(100000 + Math.random() * 900000);
//     let isPasscodeExists = await User.isPasscodeExists(retVal);
//     if (isPasscodeExists) {
//       retVal = await self.generatePasscode();
//     }
//     return resolve(retVal);
//   });
// };

// module.exports.genRandomString = function (length) {
//   return crypto
//     .randomBytes(Math.ceil(length / 2))
//     .toString("hex") /** convert to hexadecimal format */
//     .slice(0, length); /** return required number of characters */
// };

import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";

export const errorsValidator = function (object) {
  if (typeof object != "undefined" && Object.keys(object).length > 0) {
    for (var err in object) {
      return object[err][0];
    }
  }
  return "";
};

export const generateOTP = () => {
  return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
};

export const bcryptPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

export const cryptoHexToken = () => {
  const randomData = CryptoJS.lib.WordArray.random(16);
  const token = randomData.toString(CryptoJS.enc.Hex);
  return token;
};

export const generateOrderId = async () => {
  const date = new Date();
  const orderID =
    "#" +
    date.getDate() +
    date.getMonth() +
    date.getFullYear() +
    date.getHours() +
    date.getMinutes() +
    date.getSeconds() +
    date.getMilliseconds() +
    Math.floor(Math.random() * 1000);
  return orderID;
};

export const convertNumberToBoolean = (num) => {
  if (num == 0) return false;
  else return true;
};
