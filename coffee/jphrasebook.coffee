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

app.controller 'MainController', ($scope, $stateParams,
                                  $modal, Phrase, phrases) ->
  $scope.search = $stateParams.search
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

app.controller 'StatisticsController', ($scope, phrases) ->
  $scope.phrases = phrases
  $scope.words = Array.prototype.concat
    .apply [], phrases.map (phrase) -> phrase.english.split /[ .,]/
    .filter (d) -> d
  $scope.uniqueWords = d3.set($scope.words).values()
  return

app.controller 'GraphsController', ($scope, $state, phrases) ->
  width = $('#display').width()
  height = $('#display').height()
  words = (() ->
    o = {}
    Array.prototype.concat
      .apply [], phrases.map (phrase) -> phrase.english.split /[ .,]/
      .filter (d) -> d
      .forEach (word) ->
        if not o[word]?
          o[word] = 0
        o[word] += 1
    {text: word, count: count} for word, count of o
  )()

  fill = d3.scale.category20()
  sizeScale = d3.scale.linear()
    .domain d3.extent words, (w) -> w.count
    .range [10, 50]

  draw = (data) ->
    d3.select '#display'
      .append 'g'
      .attr 'transform', "translate(#{width / 2},#{height / 2})"
      .selectAll 'text'
      .data data
      .enter()
      .append 'text'
      .style
        'font-size': (d) -> "#{sizeScale d.count}px"
        'font-family': 'Impact'
        fill: (d, i) -> fill i
      .attr
        'text-anchor': 'middle'
        transform: (d) -> "translate(#{d.x},#{d.y})rotate(#{d.rotate})"
      .text (d) -> d.text
      .on 'click', (d) ->
        $state.go 'app.main', search: d.text
    return

  d3.layout.cloud()
    .size [width, height]
    .words words
    .padding 5
    .font 'Impact'
    .fontSize (d) -> sizeScale d.count
    .on 'end', draw
    .start()

  d3.select window
    .on 'resize', () ->
      newWidth = $('#display').width()
      newHeight = $('#display').height()
      d3.select '#display'
        .attr
          width: newWidth
          height: newHeight
        .select 'g'
        .attr 'transform', "translate(#{newWidth / 2},#{newHeight / 2})"
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
    url: '/main?search'
  $stateProvider.state 'app.statistics',
    controller: 'StatisticsController'
    resolve:
      phrases: (Phrase) -> Phrase.query().$promise
    templateUrl: 'partials/statistics.html'
    url: '/statistics'
  $stateProvider.state 'app.graphs',
    controller: 'GraphsController'
    resolve:
      phrases: (Phrase) -> Phrase.query().$promise
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
