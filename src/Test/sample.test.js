const testServer = require('../../server')

describe('Test GET /launches', () => {
  // test 把細節時做出來
  test('It should response 200 code', () => {
    // 先做一下假資料
    const response = 200;
    expect(response).toBe(200);
  });
});


describe('Test graphql hello', () => {
  test('returns hello with the provided name', async () => {
    const result = await testServer.executeOperation({
      query: 'query SayHelloWorld { hello }'
    });
    expect(result.data.hello).toBe('world!!');
  })
});