var getClient = function(type, uniposAuthToken) {
  var uniposAPI = {
    "find": "https://unipos.me/q/jsonrpc",
    "send": "https://unipos.me/c/jsonrpc",
    "login": "https://unipos.me/a/jsonrpc"
  };
  var xmlHttpRequest = new XMLHttpRequest();
  xmlHttpRequest.open("POST", uniposAPI[type]);
  if (type !== 'login') {
    xmlHttpRequest.setRequestHeader("x-unipos-token", uniposAuthToken);
  }
  xmlHttpRequest.setRequestHeader("content-type", "application/json");
  return xmlHttpRequest;
};

var loginUser = function(username, password) {
  var requestPayload = {
    "jsonrpc": "2.0",
    "method": "Unipos.Login",
    "params": {
      "email_address": username,
      "password": password
    },
    "id": "Unipos.Login"
  }
  return new Promise(function(resolve, reject) {
    var client = getClient('login');
    client.send(JSON.stringify(requestPayload));
    client.onreadystatechange = function() {
      if (this.readyState == 4) {
        result = JSON.parse(this.responseText);
        if (result.result) resolve(result.result.authnToken);
      }
    };
  });
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

var sendUnipos = function(userName, points, delay, message, uniposAuthToken) {
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
    }, delay);
  });
};

var processSending = function(items, timeWait) {
  for (let [index, user] of items.usersList.entries()) {
    var message = user.message;
    var points = user.points;
    if (user.message.length == 0) message = items.defaultMessage;
    if (user.points == null) points = items.defaultPoint;
    sendUnipos(user.name, points, timeWait * index + 100, message, authnToken);
  }
};
