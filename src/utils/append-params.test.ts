import { appendParams } from './append-params.js'

describe('appendParams', () => {
  it('working', async () => {
    const params = appendParams('http://localhost', {
      hello: 'world',
    })
    expect(params).equals('http://localhost/?hello=world')
  })
})
