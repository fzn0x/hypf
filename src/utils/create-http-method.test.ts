import { createHTTPMethod } from './create-http-method.js'

describe('createHTTPError', () => {
  it('working', async () => {
    const [error] = await createHTTPMethod('http://localhost', 'GET', {})
    expect(error?.message).equals('fetch failed')
  })

  it('allows override global throwOnError', async () => {
    try {
      await createHTTPMethod(
        'http://localhost',
        'GET',
        {
          initOptions: {
            throwOnError: true,
          },
        },
        {}
      )
    } catch (err) {
      expect((err as Error)?.message).equals('fetch failed')
    }
  })
})
