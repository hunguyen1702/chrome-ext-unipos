'use strict';

angular.module('uniposApp').controller('PopupController', PopupController);
PopupController.$inject = ['$window'];

function PopupController($window){
  var vm = this;
  var spinner = $('#spinner');
  spinner.addClass('ng-hide');

  vm.process = function() {
    spinner.removeClass('ng-hide');
    chrome.storage.sync.get(['usersList', 'defaultMessage', 'defaultPoint'], function(items) {
      if (items.usersList.length == 0) {
        $window.alert('Please add users before start sending process');
        spinner.addClass('ng-hide');
        return;
      }
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id, {code: 'localStorage.authnToken;'}, function(data){
          var authnToken = data[0];
          for (let [index, user] of items.usersList.entries()) {
            var message = user.message;
            var points = user.points;
            if (message.length == 0) message = items.defaultMessage;
            if (message.points == null) points = items.defaultPoint;
            sendUnipos(user.name, points, 500 * index + 100, message, authnToken);
          }
          spinner.addClass('ng-hide');
        });
      });
    });
  };

  vm.openOptionPage = function() {
    chrome.tabs.create({ url: "options.html" });
  };
}
