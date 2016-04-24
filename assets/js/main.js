var stockTicker = angular.module("stockTicker", []);

stockTicker.controller("stockTickerCtrl", function($scope, $http) {
  $scope.tickerName = "";
  $scope.tickerStatus = false;
  $scope.tickerNameResults = [];

  if(localStorage.getItem("aggregateDeck") == null) {
    $scope.aggregate = {};
  } else {
    var aggregateDeck = localStorage.getItem("aggregateDeck");
    $scope.aggregate = JSON.parse(aggregateDeck);
  }

  function stockTickerApi(symbol){
    if(symbol != undefined){
      $scope.showCard = "true";
      var tickerUrl = "http://" + location.hostname + "/proxy/?url=" + "http://finance.yahoo.com/webservice/v1/symbols/" + symbol + "/quote?format=json";
      
      $http.get(tickerUrl).
        then(function(response) {
          //TODO: Switch to return or something
          $scope.tickerNameResults = response.data.list.resources[0].resource.fields;
          $scope.tickerStatus = true;
        }, function(response) {
          console.error("Error! %s", response);
          $scope.tickerNameResults = "";
        }); 
    }
  }

  $scope.submit = function() {
    $scope.tickerNameSubmitted = $scope.tickerName;
    stockTickerApi($scope.tickerName);
  };
    
  $scope.addToDeck = function(object){
    $scope.aggregate[object.symbol] = object;

    localStorage.setItem("aggregateDeck", JSON.stringify($scope.aggregate));

    $scope.clearCurrent();
  }

  $scope.clearCurrent = function(){
    $scope.tickerNameResults = [];
    $scope.tickerStatus = false;
  }

  $scope.removeCard = function(ele){
    $("#" + ele).remove();
    delete $scope.aggregate[ele];

    localStorage.setItem("aggregateDeck", JSON.stringify($scope.aggregate));
  }

  function clearAggregate(){
    $scope.aggregate = [];
  }
});