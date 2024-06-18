import { createHTTPMethod } from './create-http-method.js'

describe('createHTTPError', () => {
  it('working', async () => {
    const [error] = await createHTTPMethod('http://localhost', 'GET', {})
    expect(error?.message).equals('fetch failed')
  })
})
