const assert = require('assert')
const Hapi = require('hapi')
const handlebars = require('handlebars')

const route = require('./route')
const dbSchema = require('./schema/db')

const options = {
  name: 'nebulis_prelaunch',
  storeBlank: false,
  cookieOptions: {
    password: process.env.YAR_PASSWORD,
    isSecure: false
  }
}

module.exports = (connection) => {
  const server = new Hapi.Server()
  const schema = dbSchema(connection)

  server.connection({ port: process.env.PORT })

  server.register([ require('vision'), require('inert'), {
    register: require('yar'),
    options: options
  } ], (err) => {
    assert.equal(err, null)

    server.views({
      engines: {
        hbs: {
          module: handlebars
        }
      },
      path: 'views',
      partialsPath: 'views/partials'
    })

    server.route(route(schema))

    server.start((err) => {
      assert.equal(err, null)

      console.log('Server running at:', server.info.uri)
    })
  })
}
