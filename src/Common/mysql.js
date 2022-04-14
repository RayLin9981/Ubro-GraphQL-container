require('dotenv').config()
const mysql = require('mysql2/promise');
const bluebird = require('bluebird');

let connection = null;
const createNewconnection = async () => {
  const connection =  await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWD,
    Promise: bluebird
  });

  // connection.connection.stream.on('close', () => {
  //   console.log("MySQL connection closed");
  // });
  return connection;
}
const getMysqlConnection = async () => {
  // Check to see if connection exists and is not in the "closing" state
  // 如果連線為 null 或是為 closing 的狀態就嘗試重新建立連線
  if (!connection || connection?.connection?._closing) {
  // if (!connection) {
    connection = await createNewconnection();
  }
  return connection;
}
const Register = async (phone, hashedPassword) => {
  const connection = await getMysqlConnection();
  const sql = "INSERT INTO User (phone, password) VALUE (?, ?)"
  return await connection.query(sql, [phone, hashedPassword])
  .then((result) => {
    // console.log('product created',result[0].insertId)
  })
  .catch((err) => console.log('register error'))

}

const UpdatePoint = async (point, phone) => {
  const connection = await getMysqlConnection();
  const sql = "UPDATE User set point=point+ ? where `phone` = ?"
  await connection.query(sql, [ point, phone])
  .then((result) => console.log('User point updated'))
  .catch((err) => console.log(err))

}
const Exchange = async (point, phone) => { 
  const connection = await getMysqlConnection();
  const sql = "UPDATE User set point=point- ? where `phone` = ?"
  await connection.query(sql, [ point, phone])
  .then((result) => console.log('exchanged product',result))
  .catch((err) => console.log(err))

}

const UpdateSecurityCode = async (code) => {
  const connection = await getMysqlConnection();
  const sql = "UPDATE Security set code = ? where `id` = 1"
  await connection.query(sql, code)
  .then((result) => console.log('SecurityCode updated',result))
  .catch((err) => console.log(err))

}

const CheckSecurityCode = async (code) => {
  const connection = await getMysqlConnection();
  checkResult = false
  const sql = "Select * from Security"
  await connection.query(sql, code)
  .then((result) => {
    dbCode = result[0][0].code
    // console.log('dbCode: ', dbCode)
    if (dbCode == code) checkResult = true
  })
  .catch((err) => console.log(err))
  return checkResult
}

const GetUser = async (phone) =>{
  const connection = await getMysqlConnection();
  const sql = "SELECT * from User where `phone` = ?"
  const results = await connection.query(sql, phone)
  return results[0][0]
}

const GetUsers = async () =>{
  const connection = await getMysqlConnection();
  const sql = "SELECT * from User"
  // const results = await connection.query(sql)
  const results = await connection.query(sql)

  // console.log(results[0])
  return results[0]
}
const GetProducts = async () =>{
  const connection = await getMysqlConnection();
  const sql = "SELECT * from Product order by point,name"
  const results = await connection.query(sql)
  // console.log("getProducts:",results[0])
  return results[0]
}
const GetProduct = async (id) =>{
  const connection = await getMysqlConnection();
  const sql = "SELECT * from Product where `id` = ?"
  const results = await connection.query(sql, id)
  // console.log(results[0])
  return results[0][0]
}
const GetExchangeRecord = async (phone) =>{
  const connection = await getMysqlConnection();
  // console.log('phone:', phone)
  const sql = "SELECT * from ExchangeRecord where `user` = ? order by createdAt desc"
  const results = await connection.query(sql, phone)
  // console.log(results[0])
  // 因為 Record 跟 user 還有 Product 不一樣 (都是只有一個)
  // Record 預計會回傳 零或多個，因此檢索到 [0] 而不是 [0][0]
  return results[0]
}

const GetExchangeRecords = async () =>{
  const connection = await getMysqlConnection();
  const sql = "SELECT * from ExchangeRecord order by createdAt desc"
  const results = await connection.query(sql)
  // console.log(results[0])
  // 因為 Record 跟 user 還有 Product 不一樣 (都是只有一個)
  // Record 預計會回傳 零或多個，因此檢索到 [0] 而不是 [0][0]
  return results[0]
}

const GetConsumeRecord = async (phone) =>{
  const connection = await getMysqlConnection();
  // console.log('phone:', phone)
  const sql = "SELECT * from ConsumeRecord where `user` = ? order by createdAt desc"
  const results = await connection.query(sql, phone)
  // console.log(results[0])
  // 因為 Record 跟 user 還有 Product 不一樣 (都是只有一個)
  // Record 預計會回傳 零或多個，因此檢索到 [0] 而不是 [0][0]
  return results[0]
}
const GetConsumeRecords = async () =>{
  const connection = await getMysqlConnection();
  const sql = "SELECT * from ConsumeRecord order by createdAt desc"
  const results = await connection.query(sql)
  // console.log(results[0])
  // 因為 Record 跟 user 還有 Product 不一樣 (都是只有一個)
  // Record 預計會回傳 零或多個，因此檢索到 [0] 而不是 [0][0]
  return results[0]
}
const CreateExchangeRecord = async (user,productName, point) =>{
  const connection = await getMysqlConnection();
  const sql = "INSERT INTO ExchangeRecord (user,productName,point) VALUE (?,?,?)"
  return await connection.query(sql, [user, productName,point])
  .then((result) => {
    // console.log('record created',result[0].insertId)
    return result[0].insertId 
  })
  .catch((err) => console.log('create error'))
}
const CreateConsumeRecord = async (user, point) =>{
  const connection = await getMysqlConnection();
  const sql = "INSERT INTO ConsumeRecord (user,point) VALUE (?, ?)"
  return await connection.query(sql, [user, point])
  .then((result) => {
    // console.log('record created',result[0].insertId)
    return result[0].insertId 
  })
  .catch((err) => console.log('create error'))
}
const CreateProduct = async (name, point) =>{
  const connection = await getMysqlConnection();
  const sql = "INSERT INTO Product (name,point) VALUE (?, ?)"
  return await connection.query(sql, [name,point])
  .then((result) => {
    // console.log('product created',result[0].insertId)
    return result[0].insertId 
  })
  .catch((err) => console.log('create error'))
}
const DeleteProduct = async (id) =>{
  const connection = await getMysqlConnection();
  const sql = "DELETE FROM Product where `id` = ?"
  let message
  await connection.query(sql, id)
  .then((result) => {(
    console.log("product deleted",result[0].affectedRows))
    message = result[0].affectedRows
  })
  .catch((err) => console.log(err))
  // 被刪除的欄位，在這裡 0 為沒刪除 , 1 為有刪
  return message
}
const UpdateProduct = async (id, name, point) =>{
  const connection = await getMysqlConnection();
  const sql = "UPDATE Product set name = ?, point = ? where `id` = ?"
  await connection.query(sql, [name,point,id])
  .then((result) => console.log('updated',result))
  .catch((err) => console.log(err))
}

const user = async (phone) => await GetUser(phone)
const users = async () =>  await GetUsers()
const register = async (phone, hashedPassword) => await Register(phone, hashedPassword)
// product CRUD
const products = async () => await GetProducts()
const product = async (id) => await GetProduct(id)
const createProduct = async (name, point) => await CreateProduct(name, point)
const deleteProduct = async (id) => await DeleteProduct(id)
const updateProduct = async (id, name, point) => await UpdateProduct(id, name, point)

const updateSecurityCode = async (code) => await UpdateSecurityCode(code)
const checkSecurityCode = async (code) => await CheckSecurityCode(code)
const updatePoint = async (point, phone) => await UpdatePoint(point, phone)
const exchange = async (point, phone) => await Exchange(point, phone)

// record
const exchangeRecord = async (phone) => await GetExchangeRecord(phone)
const exchangeRecords = async () => await GetExchangeRecords()
const consumeRecord = async (phone) => await GetConsumeRecord(phone)
const consumeRecords = async () => await GetConsumeRecords()
const createExchangeRecord = async (user, productName,point) => await CreateExchangeRecord(user,productName, point)
const createConsumeRecord = async (user, point) => await CreateConsumeRecord(user, point)
const test = async () => {
  const result = await users()
  console.log('users test result: ', result)
}


// 測試用，要用的時候記得刪掉
// connection.end()
module.exports = {
  register,
  user,
  users,
  product,
  products,
  createProduct,
  deleteProduct,
  updateProduct,
  updateSecurityCode,
  checkSecurityCode,
  updatePoint,
  exchange,
  exchangeRecord,
  exchangeRecords,
  consumeRecord,
  consumeRecords,
  createExchangeRecord,
  createConsumeRecord,
}