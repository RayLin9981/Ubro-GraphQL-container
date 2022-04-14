const { defaultFieldResolver } = require('graphql');
const { SchemaDirectiveVisitor } = require('apollo-server-lambda');


class AdminDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    //  把定義 @admin 的 field 前面先做驗證
    field.resolve = async function (...args) {
      // 登入驗證先寫在這 ， 應該可以寫得更好
      if (!args[2].me) throw new Error('login first')
      const { isAdmin } = args[2].me // isAdmin 是一個 boolean 值
      if (!isAdmin) throw new Error('u r not admin sorry > <!!');
      // 執行原本 resolve function 的內容 
      const result = await resolve.apply(this, args);
      return result;
    };
  }
}

module.exports = {
  AdminDirective
}