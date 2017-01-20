var module = angular.module("projekt4", ["ui.router"]);



module.config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider.state("home", {
        url: "/",
        templateUrl: "templates/home.html",
        controller: "homeCtrl"
    }).state("register", {
        url: "/register",
        templateUrl: "templates/register.html",
        controller:"registerCtrl"
    });
});

module.controller("homeCtrl", function ($scope, ReceptService) {
    var promise = ReceptService.getTable();
    promise.then(function (data) {
        console.log(data.data);
        $scope.table = data.data;
    });
});

module.controller("registerCtrl", function ($scope, ReceptService){    
    $scope.register = function () {
        ReceptService.register();
    };
});

module.controller("loggInCtrl", function ($scope, ReceptService){    
    $scope.loggIn = function () {
        ReceptService.loggIn($scope.username, $scope.password);
    };
});
module.service("ReceptService", function ($q, $http, $rootScope) {
    this.getTable = function () {
        var deffer = $q.defer();
        var url = "http://localhost:8080/projekt4git/webresources/table";
        $http.get(url).then(function (data) {
            deffer.resolve(data);
        });
        return deffer.promise;
    };
    
    this.loggIn = function (username, password) {
        var url = "http://localhost:8080/projekt4git/webresources/login";
        var auth = "Basic " + window.btoa(username + ":" + password);

        $http({
            url: url,
            method: "POST",
            headers: {'Authorization': auth}
        }).then(function (data) {
            console.log("Du är inloggad");
            $rootScope.isLoggdIn = true;
            $rootScope.user = username;
            $rootScope.pass = password;
        },function(data){
           console.log("Du kan inte logga in"); 
        });
    };
});

