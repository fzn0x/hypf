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
  })

  it('Supports request clone', async () => {
    const req = await createRequest(
      'https://jsonplaceholder.typicode.com/todos/1',
      {
        dryRun: true,
      },
      {},
      {
        throwOnError: true,
      }
    )

    const req2 = req.clone()

    expect(req).to.be.an.instanceOf(Request)
    expect(req2).to.be.an.instanceOf(Request)
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
