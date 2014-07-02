(function() {
  var app;

  app = angular.module('jphrasebook', ['ngResource', 'ui.router']);

  app.factory('Phrase', function($resource) {
    return $resource('/api/phrases/:phraseId');
  });

  app.controller('InstallController', function($scope, $window) {
    $scope.install = function() {
      var request, url;
      url = $window.location.origin + '/jphrasebook.webapp';
      request = $window.navigator.mozApps.install(url);
      request.onsuccess = function() {
        return console.log('success', this.result);
      };
      request.onerror = function() {
        return console.log('error', this.error);
      };
    };
  });

  app.controller('MainController', function($scope, Phrase, phrases) {
    $scope.phrases = phrases;
    $scope.newPhrase = new Phrase;
    $scope.submit = function() {
      return $scope.newPhrase.$save().then(function(phrase) {
        $scope.phrases.unshift(phrase);
        return $scope.newPhrase = new Phrase;
      });
    };
  });

  app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('login', {
      templateUrl: 'partials/login.html',
      url: '/login'
    });
    $stateProvider.state('install', {
      controller: 'InstallController',
      templateUrl: 'partials/install.html',
      url: '/install'
    });
    $stateProvider.state('main', {
      controller: 'MainController',
      resolve: {
        phrases: function(Phrase) {
          return Phrase.query().$promise;
        }
      },
      templateUrl: 'partials/main.html',
      url: '/main'
    });
    $urlRouterProvider.otherwise('/main');
  });

  app.run(function($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function() {
      var error;
      error = arguments[5];
      if (error.status === 401) {
        $state.go('login');
      }
    });
  });

}).call(this);
