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

  it('Bun supports proxy', async () => {
    try {
      await createRequest(
        'http://localhost',
        {
          proxy: 'https://username:password@proxy.example.com:8080',
        },
        {},
        {
          throwOnError: true,
        }
      )
    } catch (err) {
      expect((err as Error).message).equals('fetch failed')
    }
  })

  it('Bun supports unix', async () => {
    try {
      await createRequest(
        'http://localhost',
        {
          unix: '/var/run/docker.sock',
        },
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
