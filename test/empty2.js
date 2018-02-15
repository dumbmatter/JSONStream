var JSONStream = require('../')
  , stream = require('stream')
  , it = require('it-is')

var errors = [ ]

var pending = 2
function onerr (err) {
  it(err.message).equal('An empty string is not valid JSON');
  if (--pending > 0) return
  console.error('PASSED')
}

var parser1 = JSONStream.parse(['docs', /./])
parser1.on('data', function(data) {
  throw new Error('should never happen')
})
parser1.on('error', onerr)

var parser2 = JSONStream.parse(['docs', /./])
parser2.on('data', function(data) {
  throw new Error('should never happen')
})
parser2.on('error', onerr)

function makeReadableStream() {
  var readStream = new stream.Stream()
  readStream.readable = true
  readStream.write = function (data) { this.emit('data', data) }
  readStream.end = function (data) { this.emit('end') }
  return readStream
}

var objectArray = makeReadableStream()
objectArray.pipe(parser1)
objectArray.write('')
objectArray.end()

var objectArray = makeReadableStream()
objectArray.pipe(parser2)
objectArray.end()
