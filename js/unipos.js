var getClient = function(type, uniposAuthToken) {
  var uniposAPI = {
    "find": "https://unipos.me/q/jsonrpc",
    "send": "https://unipos.me/c/jsonrpc"
  };
  var xmlHttpRequest = new XMLHttpRequest();
  xmlHttpRequest.open("POST", uniposAPI[type]);
  xmlHttpRequest.setRequestHeader("x-unipos-token", uniposAuthToken);
  xmlHttpRequest.setRequestHeader("content-type", "application/json");
  return xmlHttpRequest;
};

var findUserId = function(userName, uniposAuthToken) {
  var requestPayload = {
    "jsonrpc": "2.0",
    "method": "Unipos.FindSuggestMembers",
    "params": {
      "term": userName,
      "limit": 1
    },
    "id": "Unipos.FindSuggestMembers"
  }
  return new Promise(function(resolve, reject) {
    var client = getClient('find', uniposAuthToken);
    client.send(JSON.stringify(requestPayload));
    client.onreadystatechange = function() {
      if (this.readyState == 4) {
        result = JSON.parse(this.responseText);
        if (result.result) resolve(result.result[0].id);
      }
    };
  });
};

var sendUnipos = function(userName, points, timeWait, message, uniposAuthToken) {
  var listOfTags = [
    '#1.AppreciateTeamwork',
    '#2.ThinkOutsideTheBox',
    '#3.HaveTheGutsToChallenge',
    '#4.ThinkPositive',
    '#5.SpeedUp',
    '#6.BeProfessional',
    '#7.FocusOnThePoint'
  ];
  findUserId(userName, uniposAuthToken).then(function(userId) {
    var requestPayload = {
      "jsonrpc":"2.0",
      "method":"Unipos.SendCard",
      "params": {
        "to_member_id": userId,
        "point": points,
        "message": listOfTags[Math.floor(Math.random()*listOfTags.length)] + ' ' + message
      },
      "id":"Unipos.SendCard"
    }
    var client = getClient('send', uniposAuthToken);
    setTimeout(function(){
      client.send(JSON.stringify(requestPayload));
      client.onreadystatechange = function() {
        if (this.readyState == 4) {
          console.log("Send to: " + userName);
          console.log("Payload: " + JSON.stringify(requestPayload));
          console.log(this.responseText);
          console.log("==========================================")
        }
      }
    }, timeWait);
  });
};
