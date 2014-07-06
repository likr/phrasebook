(function() {
  var app;

  app = angular.module('jphrasebook', ['ngResource', 'ui.router', 'ui.bootstrap']);

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

  app.controller('MainController', function($scope, $modal, Phrase, phrases) {
    $scope.phrases = phrases;
    $scope.openDialog = function() {
      var m;
      m = $modal.open({
        controller: function($scope) {
          $scope.newPhrase = new Phrase;
          $scope.submit = function() {
            return $scope.newPhrase.$save().then(function(phrase) {
              phrases.unshift(phrase);
              $scope.newPhrase = new Phrase;
              return m.close();
            });
          };
          $scope.cancel = function() {
            return m.dismiss();
          };
        },
        templateUrl: 'partials/dialog.html'
      });
    };
  });

  app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app', {
      abstract: true,
      controller: function($scope, user) {
        return $scope.user = user.email;
      },
      resolve: {
        user: function($http) {
          return $http.get('/api/auth/user').then(function(response) {
            return response.data;
          });
        }
      },
      templateUrl: 'partials/base.html'
    });
    $stateProvider.state('app.login', {
      templateUrl: 'partials/login.html',
      url: '/login'
    });
    $stateProvider.state('app.install', {
      controller: 'InstallController',
      templateUrl: 'partials/install.html',
      url: '/install'
    });
    $stateProvider.state('app.main', {
      controller: 'MainController',
      resolve: {
        phrases: function(Phrase) {
          return Phrase.query().$promise;
        }
      },
      templateUrl: 'partials/main.html',
      url: '/main'
    });
    $stateProvider.state('app.statistics', {
      templateUrl: 'partials/statistics.html',
      url: '/statistics'
    });
    $stateProvider.state('app.graphs', {
      templateUrl: 'partials/graphs.html',
      url: '/graphs'
    });
    $urlRouterProvider.otherwise('/main');
  });

  app.run(function($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function() {
      var error;
      error = arguments[5];
      if (error.status === 401) {
        $state.go('app.login');
      }
    });
  });

}).call(this);
