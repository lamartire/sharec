const { map } = require('../../actions')
const { yaspellerJson } = require('./schema')
const { createJsonPipe } = require('../../helpers/pipes')

const yaspellerJsonPipe = createJsonPipe(yaspellerJson)

const yaspellerPipe = map(['.yaspellerrc', yaspellerJsonPipe], ['.yaspeller.json', yaspellerJsonPipe])

module.exports = {
  pipe: yaspellerPipe,
}
