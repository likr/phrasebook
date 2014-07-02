app = angular.module 'jphrasebook', ['ngResource', 'ui.router']

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

app.controller 'MainController', ($scope, Phrase, phrases) ->
  $scope.phrases = phrases
  $scope.newPhrase = new Phrase

  $scope.submit = () ->
    $scope.newPhrase.$save()
      .then (phrase) ->
        $scope.phrases.unshift phrase
        $scope.newPhrase = new Phrase
  return

app.config ($stateProvider, $urlRouterProvider) ->
  $stateProvider.state 'login',
    templateUrl: 'partials/login.html'
    url: '/login'
  $stateProvider.state 'install',
    controller: 'InstallController'
    templateUrl: 'partials/install.html'
    url: '/install'
  $stateProvider.state 'main',
    controller: 'MainController'
    resolve:
      phrases: (Phrase) -> Phrase.query().$promise
    templateUrl: 'partials/main.html'
    url: '/main'
  $urlRouterProvider.otherwise '/main'
  return

app.run ($rootScope, $state) ->
  $rootScope.$on '$stateChangeError', () ->
    error = arguments[5]
    if error.status is 401
      $state.go 'login'
    return
  return
