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

  app.controller('MainController', function($scope, $stateParams, $modal, Phrase, phrases) {
    $scope.search = $stateParams.search;
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

  app.controller('StatisticsController', function($scope, phrases) {
    $scope.phrases = phrases;
    $scope.words = Array.prototype.concat.apply([], phrases.map(function(phrase) {
      return phrase.english.split(/[ .,]/);
    })).filter(function(d) {
      return d;
    });
    $scope.uniqueWords = d3.set($scope.words).values();
  });

  app.controller('GraphsController', function($scope, $state, phrases) {
    var draw, fill, height, sizeScale, width, words;
    width = $('#display').width();
    height = $('#display').height();
    words = (function() {
      var count, o, word, _results;
      o = {};
      Array.prototype.concat.apply([], phrases.map(function(phrase) {
        return phrase.english.split(/[ .,]/);
      })).filter(function(d) {
        return d;
      }).forEach(function(word) {
        if (o[word] == null) {
          o[word] = 0;
        }
        return o[word] += 1;
      });
      _results = [];
      for (word in o) {
        count = o[word];
        _results.push({
          text: word,
          count: count
        });
      }
      return _results;
    })();
    fill = d3.scale.category20();
    sizeScale = d3.scale.linear().domain(d3.extent(words, function(w) {
      return w.count;
    })).range([10, 50]);
    draw = function(data) {
      d3.select('#display').append('g').attr('transform', "translate(" + (width / 2) + "," + (height / 2) + ")").selectAll('text').data(data).enter().append('text').style({
        'font-size': function(d) {
          return "" + (sizeScale(d.count)) + "px";
        },
        'font-family': 'Impact',
        fill: function(d, i) {
          return fill(i);
        }
      }).attr({
        'text-anchor': 'middle',
        transform: function(d) {
          return "translate(" + d.x + "," + d.y + ")rotate(" + d.rotate + ")";
        }
      }).text(function(d) {
        return d.text;
      }).on('click', function(d) {
        return $state.go('app.main', {
          search: d.text
        });
      });
    };
    d3.layout.cloud().size([width, height]).words(words).padding(5).font('Impact').fontSize(function(d) {
      return sizeScale(d.count);
    }).on('end', draw).start();
    d3.select(window).on('resize', function() {
      var newHeight, newWidth;
      newWidth = $('#display').width();
      newHeight = $('#display').height();
      return d3.select('#display').attr({
        width: newWidth,
        height: newHeight
      }).select('g').attr('transform', "translate(" + (newWidth / 2) + "," + (newHeight / 2) + ")");
    });
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
      url: '/main?search'
    });
    $stateProvider.state('app.statistics', {
      controller: 'StatisticsController',
      resolve: {
        phrases: function(Phrase) {
          return Phrase.query().$promise;
        }
      },
      templateUrl: 'partials/statistics.html',
      url: '/statistics'
    });
    $stateProvider.state('app.graphs', {
      controller: 'GraphsController',
      resolve: {
        phrases: function(Phrase) {
          return Phrase.query().$promise;
        }
      },
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
