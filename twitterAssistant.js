var fs = require('fs');
require('dotenv').config()

// WATSON CREDENTIALS
const AssistantV2 = require('ibm-watson/assistant/v2');
const ASSISTANT = new AssistantV2({
  version: process.env.VERSION_ASSISTANT,
  iam_apikey: process.env.IAM_APIKEY_ASSISTANT,
  url: process.env.URL_ASSISTANT
});

const assistantId = process.env.ASSISTANT_ID

function createSession(){ // Create a Watson Assistant Session
  return ASSISTANT.createSession({
    assistant_id: assistantId
  })
}

function sendMessage (sessionId, message){ // Send a Watson Assistant Message
  return ASSISTANT.message({
    assistant_id: assistantId,
    session_id: sessionId,
    input: {
      'message_type': 'text',
      'text': message,
      options: {
        return_context: false,
        alternate_intents: true
      }
    },
    context: {}
  })
}

async function classify(candidato) {
  var data = fs.readFileSync('testTweets/' + candidato + '.csv')
    .toString()
    .split('\n')
    .map(e => e.trim())
    .map(e => e.split('\n').map(e => e.trim()));
  try {
    let { session_id } = await createSession()
    tweetPos = Math.floor(Math.random() * data.length)
    let { output } = await sendMessage(session_id, data[tweetPos][0])
    let { intent } = output.intents[0]
    console.log('Tweet: ' + data[tweetPos])
    console.log()
    console.log('Intencion: ' + intent)
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
