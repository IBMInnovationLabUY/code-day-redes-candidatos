var fs = require('fs');
require('dotenv').config()

// WATSON CREDENTIALS
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js');
const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2019-07-12',
  iam_apikey: '9aipnZ7T-5cjueiETpMYdWKJMgj691WNzpKQYciciKYj',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api'
});

function analyze (message){ // Send a Watson Assistant Message
  const analyzeParams = {
    'text': message,
    'features': {
      'emotion': {
        'targets': [
          'lacalle pou',
          'talvi',
          'daniel martinez'
        ]
      },
      'entities': {
        'sentiment': true,
        'emotion': true
      },
      'keywords': {
        "sentiment": true,
        "emotion": true
      },
      'sentiment': {
        'targets': [
          'lacalle pou',
          'talvi',
          'daniel martinez'
        ]
      }
    },
    'language': 'es'
  };

  return naturalLanguageUnderstanding.analyze(analyzeParams)
}

async function classify(candidato) {
  var data = fs.readFileSync('testTweets/' + candidato + '.csv')
    .toString()
    .split('\n')
    .map(e => e.trim())
    .map(e => e.split(',').map(e => e.trim()));
  try {
    tweetPos = Math.floor(Math.random() * data.length-1)
    let output = await analyze(data[tweetPos][0])
    sentiment = JSON.stringify(output.sentiment, null, 2) + '\n'
    keywords = JSON.stringify(output.keywords, null, 2) + '\n'
    entities = JSON.stringify(output.entities, null, 2) + '\n'
    console.log('Tweet: ' + data[tweetPos])
    console.log()
    console.log('Sentimiento: ' + sentiment)
    console.log()
    console.log('Keywords: ' + keywords)
    console.log()
    console.log('Entidades: ' + entities)
    console.log()
  } catch (e) {
    console.log(e)
  }
}
candidatos = ['daniel-martinez', 'lacalle-pou', 'talvi']
console.log()
for (let index = 0; index < candidatos.length; index++) {
  const candidato = candidatos[index];
  classify(candidato)
}
