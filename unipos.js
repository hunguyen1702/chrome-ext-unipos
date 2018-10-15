var getClient = function(type) {
  var uniposAPI = {
    "find": "https://unipos.me/q/jsonrpc",
    "send": "https://unipos.me/c/jsonrpc"
  };
  var xmlHttpRequest = new XMLHttpRequest();
  var uniposAuthToken = localStorage.authnToken;
  xmlHttpRequest.open("POST", uniposAPI[type]);
  xmlHttpRequest.setRequestHeader("x-unipos-token", uniposAuthToken);
  xmlHttpRequest.setRequestHeader("content-type", "application/json");
  xmlHttpRequest.setRequestHeader("authority", "unipos.me");
  return xmlHttpRequest;
};

var findUserId = function(userName) {
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
    var client = getClient('find');
    client.send(JSON.stringify(requestPayload));
    client.onreadystatechange = function() {
      result = JSON.parse(this.responseText);
      if (result.result) resolve(result.result[0].id);
    };
  });
};

var sendUnipos = function(ownerId, userName, points, timeWait, message) {
  var listOfTags = [
    '#1.AppreciateTeamwork',
    '#2.ThinkOutsideTheBox',
    '#3.HaveTheGutsToChallenge',
    '#4.ThinkPositive',
    '#5.SpeedUp',
    '#6.BeProfessional',
    '#7.FocusOnThePoint'
  ];
  findUserId(userName).then(function(userId) {
    var requestPayload = {
      "jsonrpc":"2.0",
      "method":"Unipos.SendCard",
      "params": {
        "from_member_id": ownerId,
        "to_member_id": userId,
        "point": points,
        "message": listOfTags[Math.floor(Math.random()*listOfTags.length)] + ' ' + message
      },
      "id":"Unipos.SendCard"
    }
    var client = getClient('send');
    setTimeout(function(){
      client.send(JSON.stringify(requestPayload));
    }, timeWait);
  });
};
