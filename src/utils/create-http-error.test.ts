import { createHTTPError } from './create-http-error.js'

describe('createHTTPError', () => {
  it('working', async () => {
    const params = createHTTPError(new Response())
    expect(params.message).equals('Status code: 200')
  })
})
