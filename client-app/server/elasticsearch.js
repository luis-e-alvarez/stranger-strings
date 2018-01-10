const elasticsearch = require('elasticsearch');
let AWS = require('aws-sdk');

AWS.config.update({
  credentials: new AWS.Credentials(config.AWSKEY, config.AWSPASSWORD),
  region: 'us-east-1'
});
const elasticsearchClient = new elasticsearch.Client({
  hosts: [config.AWSELASTICSEARCH],
  log: 'info',
  connectionClass: require('http-aws-es'),
});

const indexName = 'content';

const deleteIndex = () => {
  return elasticsearchClient.indices.delete({
    index: indexName
  });
};

const initIndex = () => {
  return elasticsearchClient.indices.create({
    index: indexName
  });
};

async function indexExists () {
  let reply = await elasticsearchClient.indices.exists({
    index: indexName
  });
  console.log(reply);
};

const addToIndex = () => {
  elasticsearchClient.index({
    index: 'content',
    id: '1',
    type: 'video',
    body: {
      'VideoTitle': `Reclaiming "Haunt": One Ghost's Struggle To Fit In!`,
      'Description': 'SCARY STAY AWAY!',
      'Genre': 'Horror',
      'Popular': 'True',
    }
  }, function(err, resp, status) {
    console.log(resp);
  });
};

async function search (term) {
  term = term.toLowerCase();
  try {
    let resp = await elasticsearchClient.search({
      index: 'content',
      type: 'video',
      body: {
        query: {
          bool: {
            should: [
            { wildcard : { Description: `*${term}*`}},
            { wildcard:  { VideoTitle: `*${term}*` }},
            ],
          }
        }
      }
    });
    var results = resp.hits.hits;
    let searchResults = results.map((item) => {
        return item._source;
      });
      return searchResults;
  } catch (error) {
    console.log(error)
  }
}



module.exports = {
  deleteIndex,
  initIndex, 
  indexExists,
  elasticsearchClient,
  search
};