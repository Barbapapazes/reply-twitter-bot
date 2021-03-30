import dotenv from 'dotenv'
dotenv.config()
import Twitter from 'twitter'

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
})

const trackName = process.env.TRACK_NAME
const reply = 'Bark Bark Bark 🐶'
const stream = client.stream('statuses/filter', { track: '@' + trackName })

stream.on('data', function (event) {
  if (
    event.in_reply_to_status_id &&
    event.in_reply_to_screen_name != trackName
  ) {
    console.log(event)
    client.post(
      'statuses/update',
      {
        status: reply,
        in_reply_to_status_id: event.in_reply_to_status_id_str,
        auto_populate_reply_metadata: true,
      },
      function (error, tweet, response) {
        if (!error) {
          console.log(tweet)
        } else {
          throw error
        }
      }
    )
  }
})

stream.on('error', function (error) {
  throw error
})
