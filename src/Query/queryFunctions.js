
const user = async (root, { phone }, { userModel }) => await userModel.user(phone)
const users = async (root, args, { userModel }) => await userModel.users()
const product = async (root, { id }, { userModel }) => await userModel.product(id)
const products = async (root, args, { userModel }) =>  await userModel.products()
const exchangeRecord = async (root, { phone }, { userModel } ) => await userModel.exchangeRecord(phone)
const exchangeRecords = async (root, args, { userModel }) => await userModel.exchangeRecords()
const consumeRecords = async (root, args, { userModel }) => await userModel.consumeRecords()
const me = async (root, args, { me, userModel }) => {
  if (!me) throw new Error('NOT_LOGGIN');
  return await userModel.user(me.phone)
}

module.exports = {
  user,
  users,
  product,
  products,
  me,
  exchangeRecord,
  exchangeRecords,
  consumeRecords,
}