const redis = require('redis');
var client = redis.createClient({ "host":'redis', "port": "6379" });

client.on('connect', ()=>{
  console.log('connected!');
});

module.exports = {
  client
};