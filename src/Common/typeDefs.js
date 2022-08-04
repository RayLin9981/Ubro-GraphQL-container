const { gql } = require('apollo-server-lambda');

const typeDefs = gql`
" 先檢查是否 login 後檢查權限 ( 檢查 User 的 isAdmin 欄位 ) "
directive @admin on FIELD_DEFINITION

scalar DateResolver

"預設的密碼是 12345"
  type User {
    phone: String
    point: Int
    isAdmin: Boolean
    exchangeRecords: [ExchangeRecord]
    consumeRecords: [ConsumeRecord]
  }
  "提供兌換的獎項"
  type Product {
    id: Int
    name: String
    point: Int
  }
  "兌獎紀錄，目前時間是顯示到日(要到時分秒可能要再看一下)"
  type ExchangeRecord {
    id: Int,
    user: String,
    productName: String,
    point: Int,
    createdAt: DateResolver
  }
  "集點紀錄"
  type ConsumeRecord {
    id: Int,
    user: String,
    point: Int,
    createdAt: DateResolver
  }
  " Usage: header: 'Authorization' : 'Bearer <YOUR_TOKEN> '"
  type Token {
    token: String!
  }
  type Query {
    "使用 phone 找 User"
    user(phone: String!): User
    " 列出所有 User"
    users: [User]
    " 列出登入者的資訊 ( 要登入才能使用 )"
    me: User
    "使用 productId 找 Product"
    product(id:Int!): Product
    "列出所有 Product"
    products: [Product]
    "列出所有的兌換獎品紀錄 "
    exchangeRecords: [ExchangeRecord]
    "列出所有消費(集點)的紀錄"
    consumeRecords: [ConsumeRecord]
    "要登入 Admin 帳號才可呼叫"
    adminHello: String @admin
    hello: String
  }

  input RegisterInput {
    phone: String!
  }
  input LoginInput {
    phone: String!
    password: String!
  }
  input CreateProductInput {
    name: String!
    point: Int!
  }
  input UpdateProductInput{
    id: Int!
    name : String
    point: Int
  }
  input UpdatePointInput{
    point: Int!
    securityCode: String!
  }
  type Mutation {
    "輸入 phone 註冊，並使用 phone 當作密碼 (要不要乾脆把 input 簡化成 phone ?)"
    register(input: RegisterInput!): User
    "登入，回傳 Token"
    login (input: LoginInput!): Token
    "管理者登入，透過檢查 isAdmin 欄位來辨識是否為管理者"
    adminLogin (input: LoginInput!): Token
    "新增可兌換獎項"
    createProduct(input: CreateProductInput!): Product @admin
    "更新獎項(更新名稱或需要點數)"
    updateProduct(input: UpdateProductInput!): Product @admin
    "刪除獎項"
    deleteProduct(id: Int!): Int @admin
    "更新集點時輸入的安全碼"
    updateSecurityCode(code: String!): String @admin
    "使用點數交換獎項"
    exchange(productId: Int!) : Int
    "消費時集點，需要安全碼確認操作為店家進行"
    updatePoint(input: UpdatePointInput) : String
  }
`;

module.exports = {
  typeDefs
}