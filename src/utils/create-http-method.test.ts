import { createHTTPMethod } from './create-http-method.js'

describe('createHTTPError', () => {
  it('working', async () => {
    const [error] = await createHTTPMethod('http://localhost', 'GET', {}, undefined)
    expect(error?.message).equals('fetch failed')
  })
})
