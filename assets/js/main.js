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
      var tickerUrl = "http://" + location.hostname + "/proxy/?url=" + "http://finance.yahoo.com/webservice/v1/symbols/" + symbol + "/quote?format=json";
      
      $http.get(tickerUrl).
        then(function(response) {
          var resultsResponse = response.data.list.resources[0].resource.fields;

          if(resultsResponse != undefined){
            $scope.tickerNameResults = resultsResponse;
            $scope.tickerStatus = true;
          } else {
            $scope.tickerNameResults = "";
          }
          
        }, function(response) {
          //console.error("Error! %s", response);
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