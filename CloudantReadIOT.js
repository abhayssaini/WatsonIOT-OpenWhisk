/**
 * Read a document in Cloudant database:
 * https://docs.cloudant.com/document.html#read
 **/
var request  = require("request");
function main(message) {
  var cloudantOrError = getCloudantAccount(message);
  if (typeof cloudantOrError !== 'object') {
    return Promise.reject(cloudantOrError);
  }
  var cloudant = cloudantOrError;
  var dbName = message.dbname;
  var docId = message.docid || message.id;
  var params = {};

  if(!dbName) {
    return Promise.reject('dbname is required.');
  }
  if(!docId) {
    return Promise.reject('docid is required.');
  }
  var cloudantDb = cloudant.use(dbName);

  if (typeof message.params === 'object') {
    params = message.params;
  } else if (typeof message.params === 'string') {
    try {
      params = JSON.parse(message.params);
    } catch (e) {
      return Promise.reject('params field cannot be parsed. Ensure it is valid JSON.');
    }
  }

  return readDocument(cloudantDb, docId, params);
}

function readDocument(cloudantDb, docId, params) {
    var orgId="OrganizationId"
    var deviceType="DeviceType"
    var deviceId = "DeviceId"
    var authToken ="AuthToken"
   var auth='Basic ' + Buffer.from("use-token-auth" + ':' + authToken).toString('base64');
  return new Promise(function(resolve, reject) {
    cloudantDb.get(docId, params, function(error, response) {
      if (!error) {
          var data = {
        response
        }
    request.post( "https://"+orgId+".messaging.internetofthings.ibmcloud.com:8883/api/v0002/device/types/"+deviceType+"/devices/"+deviceId+"/events/query",
        {
            json: data,  // your payload data placed here
            headers: {
                'Authorization': auth, // if authentication needed
                'Content-Type': 'application/json' 
            }
        }, function (error, response, body) {
            if (error) {
                callback(error, null)
            } else {
                callback(error, response.body)
            }
        });
        resolve(response);
      } else {
        console.error('error', error);
        reject(error);
      }
    });
  });
}

function getCloudantAccount(message) {
  // full cloudant URL - Cloudant NPM package has issues creating valid URLs
  // when the username contains dashes (common in Bluemix scenarios)
  var cloudantUrl;

  if (message.url) {
    // use bluemix binding
    cloudantUrl = message.url;
  } else {
    if (!message.host) {
      return 'cloudant account host is required.';
    }
    if (!message.username) {
      return 'cloudant account username is required.';
    }
    if (!message.password) {
      return 'cloudant account password is required.';
    }

    cloudantUrl = "https://" + message.username + ":" + message.password + "@" + message.host;
  }

  return require('cloudant')({
    url: cloudantUrl
  });
}
