app = angular.module 'jphrasebook', ['ngResource', 'ui.router', 'ui.bootstrap']

app.factory 'Phrase', ($resource) ->
  $resource '/api/phrases/:phraseId'

app.controller 'InstallController', ($scope, $window) ->
  $scope.install = () ->
    url = $window.location.origin + '/jphrasebook.webapp'
    request = $window.navigator.mozApps.install url
    request.onsuccess = () ->
      console.log 'success', this.result
    request.onerror = () ->
      console.log 'error', this.error
    return
  return

app.controller 'MainController', ($scope, $modal, Phrase, phrases) ->
  $scope.phrases = phrases

  $scope.openDialog = () ->
    m = $modal.open
      controller: ($scope) ->
        $scope.newPhrase = new Phrase
        $scope.submit = () ->
          $scope.newPhrase.$save()
            .then (phrase) ->
              phrases.unshift phrase
              $scope.newPhrase = new Phrase
              m.close()
        $scope.cancel = () ->
          m.dismiss()
        return
      templateUrl: 'partials/dialog.html'
    return
  return

app.config ($stateProvider, $urlRouterProvider) ->
  $stateProvider.state 'app',
    abstract: true
    controller: ($scope, user) ->
      $scope.user = user.email
    resolve:
      user: ($http) ->
        $http.get '/api/auth/user'
          .then (response) -> response.data
    templateUrl: 'partials/base.html'
  $stateProvider.state 'app.login',
    templateUrl: 'partials/login.html'
    url: '/login'
  $stateProvider.state 'app.install',
    controller: 'InstallController'
    templateUrl: 'partials/install.html'
    url: '/install'
  $stateProvider.state 'app.main',
    controller: 'MainController'
    resolve:
      phrases: (Phrase) -> Phrase.query().$promise
    templateUrl: 'partials/main.html'
    url: '/main'
  $stateProvider.state 'app.statistics',
    templateUrl: 'partials/statistics.html'
    url: '/statistics'
  $stateProvider.state 'app.graphs',
    templateUrl: 'partials/graphs.html'
    url: '/graphs'
  $urlRouterProvider.otherwise '/main'
  return

app.run ($rootScope, $state) ->
  $rootScope.$on '$stateChangeError', () ->
    error = arguments[5]
    if error.status is 401
      $state.go 'app.login'
    return
  return
