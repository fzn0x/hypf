import { createRequest } from './create-request.js'

describe('createRequest', () => {
  it('throwOnError', async () => {
    try {
      await createRequest(
        'http://localhost',
        {},
        {},
        {
          throwOnError: true,
        }
      )
    } catch (err) {
      expect((err as Error).message).equals('fetch failed')
    }
  })
})
