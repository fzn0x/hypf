import { createHTTPError } from './create-http-error.js'

describe('createHTTPError', () => {
  it('working', async () => {
    const params = createHTTPError(new Response(), new Response())
    expect(params.message).equals('status code 200')
  })
})
