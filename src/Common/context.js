const jwt = require('jsonwebtoken');
const userModel = require('./mysql');

require('dotenv').config()

const SECRET = process.env.SECRET;
const context =  async ({ event, context }) => {
  // console.log('query: ', event.body)
  let token = event.headers['Authorization'];
  if (token != undefined) {  // 避免沒給 token 的時候報錯
    token = event.headers['Authorization'].replace('Bearer ', '')
  }
  if (token) {
    try {
      const me = await jwt.verify(token, SECRET);
      return { me, event, context, userModel };
    }
    catch (e) {
      throw new Error('Your session expired. Sign in again.');
    }
  }
  // userModel 沒登入應該不給
  return { event, context, userModel };
}

module.exports = {
  context
}