'use strict';

angular.module('uniposApp').controller('OptionController', OptionController);
OptionController.$inject = ['$scope', '$window']

function OptionController($scope, $window){
  var vm = this;
  vm.usersList = [];
  vm.defaultMessage = '';
  vm.defaultPoint = null;

  vm.loadSettings = function() {
    chrome.storage.sync.get(['usersList', 'defaultMessage', 'defaultPoint'], function(data) {
      vm.usersList = data.usersList;
      vm.defaultMessage = data.defaultMessage;
      vm.defaultPoint = data.defaultPoint;
      $scope.$apply();
    });
  };

  vm.newEntry = function() {
    var emptyUser = vm.usersList.filter(user => user.name === '');
    if (emptyUser.length > 0) {
      return;
    }
    vm.usersList.push({
      name: '',
      points: null,
      message: ''
    });
  };

  vm.deleteEntry = function(index) {
    vm.usersList.splice(index, 1);
  };

  vm.saveSettings = function(e) {
    if (vm.defaultMessage === '' || vm.defaultPoint === 0) {
      $window.alert('You need to settings default points & message');
      return;
    }
    vm.usersList = vm.usersList.filter(user => user.name !== '');
    chrome.storage.sync.set({
      usersList: vm.usersList,
      defaultMessage: vm.defaultMessage,
      defaultPoint: vm.defaultPoint
    }, function() {
      $window.alert('Saved');
    });
    event.preventDefault();
  };
}
