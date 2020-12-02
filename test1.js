const youtubedl = require('youtube-dl')
const url = 'https://www.youtube.com/watch?v=1yKSRPwsPSA'

youtubedl.exec(url, ['-x', '--audio-format', 'mp3'], {}, function(err, output) {
  if (err) throw err
  last = output[3].split(":")[1].substring(1)
  console.log(last)
})