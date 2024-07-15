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

  it('Supports response clone', async () => {
    try {
      const res = await createRequest(
        'https://jsonplaceholder.typicode.com/todos/1',
        {},
        {},
        {
          throwOnError: true,
        }
      )

      const response2 = res.clone()

      expect(res).to.be.an.instanceOf(Response)
      expect(response2).to.be.an.instanceOf(Response)
      expect(await res.json()).to.be.an.instanceOf(Object)
      expect(await response2.json()).to.be.an.instanceOf(Object)
    } catch (err) {
      console.log(err)
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
