const server = require('express')()
const parser = require('body-parser')
const fetch = require('node-fetch')

server.use(parser.urlencoded({extended: false}))

server.use((req, res, next) => {
  // add cors headers
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  // pass it on
  next()
})

const urlEncode = function formatFromJSONtoUrlEncoded (JSONdata) {
  return Object.keys(JSONdata).reduce((acc, key) => {
    return acc += `${acc.length ? '&' : ''}${key}=${JSONdata[key]}`
  }, '')
}

server.post('/api/v1/survey', (req, res) => {
  const surveyData = urlEncode(req.body) 
  const opts = {
    method: 'post',
    body: surveyData,
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  if(!process.env.GFORM_ENDPOINT) {
    return console.error('=======\n\nYOU DIDNT SET THE CONFIG VAR, JOE\n\n========')
  }
  return fetch(process.env.GFORM_ENDPOINT, opts)
  .then(googleResponse => googleResponse.text())
  .then((text) => {
    // if we got googles html reponse, it worked! ( i think this is fine )
    if(text.length > 10000) res.sendStatus(200).end()
  })
  .catch(err => console.error('nay\n\n', err))
})

server.listen(process.env.PORT || 3000)
