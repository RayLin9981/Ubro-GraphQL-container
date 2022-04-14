const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const SALT_ROUNDS = 2;
const SECRET = process.env.SECRET;
// hash 用於 register ，加密密碼存進資料庫
const hash = text => bcrypt.hash(text, SALT_ROUNDS);
const createToken = ({ phone, isAdmin }) => jwt.sign({ phone, isAdmin }, SECRET, {
  expiresIn: '1h'
});

const register = async (parent, { input }, {userModel}) => {
  const { phone } = input
  const user = await userModel.user(phone)
  // 到資料庫找，如果有就代表重複
  if (user) throw new Error('USER_PHONE_DUPLICATE');
  const hashedPassword = await hash(phone, SALT_ROUNDS) // 先把 phone 當作密碼加密
  // 註冊
  await userModel.register(phone, hashedPassword)
  const newUser = await userModel.user(phone)
  return newUser
}

const login = async (parent, { input }, { userModel }) => {
  const { phone, password } = input
  // 呼叫 mysql.js 裡面使用 phone 去找 user 的方法
  const user = await userModel.user(phone)
  if (!user) throw new Error('PHONE_NOT_REGISTER')

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) throw new Error('PASSWORD_ERROR');

  return { token: createToken(user) }
}

const adminLogin = async (parent, { input }, { userModel }) => {
  const { phone, password } = input
  const user = await userModel.user(phone)
  if (!user) throw new Error('PHONE_NOT_REGISTER')

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) throw new Error('PASSWORD_ERROR');
  if (!user.isAdmin) throw new Error('NOT_ADMIN')

  return { token: createToken(user) }
}

// 
const createProduct = async (parent, { input }, { userModel }) => {
  const { name, point } = input
  const newProductId = await userModel.createProduct(name, point)
  // console.log('productId:' , newProductId)
  const product = await userModel.product(newProductId)
  // console.log('resolver Product', product)
  return product
}

const updateProduct = async (parent, { input }, { userModel }) => {
  const { id, name, point } = input
  await userModel.updateProduct(id, name, point)
  const product = await userModel.product(id)
  return product
}

const deleteProduct = async (parent, args, { userModel }) => {
  const { id } = args
  const result = await userModel.deleteProduct(id)
  // 被刪除的欄位，在這裡 0 為沒刪除 , 1 為有刪
  if (result == 0) throw new Error('delete Error')// 再看看沒刪到要怎樣
  return id
}

const updateSecurityCode = async (parent, { code }, { userModel }) => {
  await userModel.updateSecurityCode(code)
  return code
}

// 兌換獎項
const exchange = async (parent, { productId }, { userModel, me }) => {
  if (!me) throw new Error('login first')
  const product = await userModel.product(productId)
  const costPoint = product.point
  const productName = product.name
  const user = await userModel.user(me.phone)
  const userPoint = user.point
  //  點數不夠換
  if (costPoint > userPoint) throw new Error('Point not enough!!!')
  // 更新 user 點數部分
  await userModel.exchange(costPoint, me.phone)
  // 更新 ExchangeRecord 資料表部分
  await userModel.createExchangeRecord(me.phone, productName, costPoint)
  // 回傳換完的點數
  return userPoint - costPoint
}

const updatePoint = async (parent, { input }, { userModel, me }) => {
  if (!me) throw new Error('NOT_LOGGIN')
  const { point, securityCode } = input
  // 安全碼錯誤
  checkResult = await userModel.checkSecurityCode(securityCode)
  if (!checkResult) throw new Error('SECURITY_CODE_IS_NOT_CORRECT')
  // 更新 user 點數部分
  await userModel.updatePoint(point, me.phone)
  // 更新 ConsumeRecord 資料表部分
  await userModel.createConsumeRecord(me.phone,point)
  // ??
  return 'user point updated'
}

module.exports = {
  register,
  login,
  adminLogin,
  createProduct,
  updateProduct,
  deleteProduct,
  updateSecurityCode,
  exchange,
  updatePoint
}