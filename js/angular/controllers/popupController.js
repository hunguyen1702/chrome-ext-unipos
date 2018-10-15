'use strict';

angular.module('uniposApp').controller('PopupController', PopupController);

function PopupController(){
  var vm = this;

  vm.sendUnipos = function() {

  };

  vm.openOptionPage = function() {
    chrome.tabs.create({ url: "options.html" });
  };
}
