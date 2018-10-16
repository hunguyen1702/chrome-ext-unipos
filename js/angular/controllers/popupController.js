'use strict';

angular.module('uniposApp').controller('PopupController', PopupController);
PopupController.$inject = ['$window'];

function PopupController($window){
  var vm = this;
  var spinner = $('#spinner');
  spinner.addClass('ng-hide');

  vm.process = function() {
    spinner.removeClass('ng-hide');
    chrome.storage.sync.get(['usersList', 'defaultMessage', 'defaultPoint'], function(data) {
      if (data.usersList.length == 0) {
        $window.alert('Please add users before start sending process');
        spinner.addClass('ng-hide');
        return;
      }
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id, {code: 'var token = localStorage.authnToken;'}, function(data){
          var authnToken = data[0];
          // for (let user of data.usersList) {
          //   var message = user.message;
          //   var points = user.points;
          //   if (message.length == 0) message = data.defaultMessage;
          //   if (message.points == null) points = data.defaultPoint;
          // }
          spinner.addClass('ng-hide');
        });
      });
    });
  };

  vm.openOptionPage = function() {
    chrome.tabs.create({ url: "options.html" });
  };
}
