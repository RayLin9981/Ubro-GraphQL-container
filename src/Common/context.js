const jwt = require('jsonwebtoken');
const userModel = require('./mysql');

require('dotenv').config()

const SECRET = process.env.SECRET;
const context =  async ({ req }) => {
  // console.log('query: ', event.body)
  let token = req.headers['Authorization'];
  if (token != undefined) {  // 避免沒給 token 的時候報錯
    token = req.headers['Authorization'].replace('Bearer ', '')
  }
  if (token) {
    try {
      const me = await jwt.verify(token, SECRET);
      return { me,  userModel };
    }
    catch (e) {
      throw new Error('Your session expired. Sign in again.');
    }
  }
  // userModel 沒登入應該不給
  return { userModel };
}

module.exports = {
  context
}