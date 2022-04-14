const { ApolloServer } = require('apollo-server-lambda');
const { DateResolver } = require('graphql-scalars')

const { context } = require('./src/Common/context')
const { typeDefs } = require('./src/Common/typeDefs')
const { AdminDirective } = require('./src/Common/directive')
// Query
const queryFunc = require('./src/Query/queryFunctions')
// Mutation
const mutationFunc = require('./src/Mutation/mutationFunctions')

require('dotenv').config()
const resolvers = {
  DateResolver,
  User: {
    exchangeRecords: async (parent, args, {userModel}) =>{
      phone = parent.phone
      return await userModel.exchangeRecord(phone)
    },
    consumeRecords: async (parent, args, {userModel}) =>{
      phone = parent.phone
      return await userModel.consumeRecord(phone)
    }
  },
  Query: {
    adminHello: (root, args, { me }) => "admin world!!",
    user: queryFunc.user,
    users: queryFunc.users,
    me: queryFunc.me,
    product: queryFunc.product,
    products: queryFunc.products,
    exchangeRecords: queryFunc.exchangeRecords,
    consumeRecords: queryFunc.consumeRecords
  },
  Mutation: {
    register: mutationFunc.register,
    login: mutationFunc.login,
    adminLogin: mutationFunc.adminLogin,
    createProduct: mutationFunc.createProduct,
    updateProduct: mutationFunc.updateProduct,
    deleteProduct: mutationFunc.deleteProduct,
    updateSecurityCode: mutationFunc.updateSecurityCode,
    exchange: mutationFunc.exchange,
    updatePoint: mutationFunc.updatePoint,
  }
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    admin: AdminDirective
  },
  playground: {
    endpoint: "/dev/graphql"
  },
  tracing: true,
  context
});

exports.graphqlHandler = server.createHandler({
  cors: {
    origin: true,
    credentials: true,
  },
});
