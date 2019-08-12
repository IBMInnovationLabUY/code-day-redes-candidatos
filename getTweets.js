require('dotenv').config()

const fs = require('fs');
var request = require('request');

async function getTweets() {
  year = '2019'
  month = '07'
  fromHour = '07'
  toHour = '22'
  minutes = '00'
  days = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
  candidatos = ['daniel martinez', 'lacalle pou', 'talvi']

  for (let index_days = 0; index_days < days.length; index_days++) {
    var day = days[index_days];
    let fromDate = year+month+day+fromHour+minutes
    let toDate = year+month+day+toHour+minutes
    var maxResults = '100'

    for (let index_candidatos = 0; index_candidatos < candidatos.length; index_candidatos++) {
      const query = candidatos[index_candidatos];
      var options = {
        headers: {
          'Authorization': process.env.ACCESS_TOKEN_TWITTER
        },
        uri: process.env.URL_TWITTER_30_DAY,
        body: JSON.stringify({
          query:  '"'+query+'" -has:links -RT',
          maxResults: maxResults,
          fromDate: fromDate,
          toDate: toDate
        })
      };

      request.post(options, function(err, response, body) {
        if (err) {
          console.log(err)
        } else {
          console.log('Query: '+query+' - Dia: '+day+' - OK')
          fs.writeFile('apiTwitter/tweets_'+query+'_'+fromDate+'_'+toDate+'.txt', body, (err) => {
            if (err) throw err;
          });
          try {
            tweets = JSON.parse(body)
            resultados = tweets['results']
            for (let index = 0; index < resultados.length; index++) {
              const tweet = resultados[index];
              let {
                text,
                extended_tweet
              } = tweet
              extended_tweet ? write = extended_tweet.full_text : write = text
              write = write.replace(/\n/g, ' ')
              write = write + '\n'
              fs.appendFile('apiTwitter/'+query+'.csv', write, (err) => {
                if (err) throw err;
              });
            }
          } catch (error) {
            console.log(error)
          }
        }
      })
    }
    await new Promise(done => setTimeout(done, 6000));
  }
}

var options = {
  auth: {
    'user': process.env.API_KEY,
    'pass': process.env.API_SECRET_KEY
  },
  uri: process.env.TOKEN_URL_TWITTER,
};

request.post(options, function(err, response, body) {
  if (err) {
    console.log(err)
  } else {
    body = JSON.parse(body)
    if (body.errors){
      console.log(body.errors[0].message)
    } else {
      access_token = body.access_token
      access_token = 'ACCESS_TOKEN_TWITTER = Bearer ' + access_token
      fs.appendFile('.env', access_token, (err) => {
        if (err) throw err;
      });
      getTweets()
    }
  }
})



