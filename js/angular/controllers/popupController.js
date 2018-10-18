'use strict';

angular.module('uniposApp').controller('PopupController', PopupController);
PopupController.$inject = ['$window'];

function PopupController($window){
  var vm = this;
  const timeWait = 500;
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
          processSending(items, timeWait, authnToken);
          spinner.addClass('ng-hide');
        });
      });
    });
  };

  vm.openOptionPage = function() {
    chrome.tabs.create({ url: "options.html" });
  };

  vm.testAlarm = function() {
    var alarmName = 'testAlarm';
    chrome.alarms.getAll(function(alarms){
      var hasAlarm = alarms.some(function(a){
        return a.name == alarmName;
      });
      if (hasAlarm) {
        console.log('Stop current alarm');
        chrome.alarms.clear(alarmName);
      } else {
        console.log('Create a new alarm');
        chrome.alarms.create(alarmName, {periodInMinutes: 0.01})
      }
    });
  };
}
