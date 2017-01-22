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
    }).state("addrecept", {
        url: "/addrecept",
        templateUrl: "templates/addrecept.html",
        controller:"addreceptCtrl"
    });
});

module.controller("homeCtrl", function ($scope, ReceptService) {
    var promise = ReceptService.getTable();
    promise.then(function (data) {
        console.log(data.data);
        $scope.table = data.data;
    });
});

module.controller("addreceptCtrl", function ($scope, $rootScope, ReceptService) {    
    $scope.addRecept = function () {
        ReceptService.addRecept($scope.r_namn,$scope.instruktion,Number($scope.author),$scope.kategori,$scope.imglink);
    };
});

module.controller("registerCtrl", function ($scope, ReceptService){    
    $scope.register = function () {
        ReceptService.register($scope.username, $scope.password);
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
    
    this.register = function (username, password) {
        var data = {
            username:username,
            password: password
        };
        var url = "http://localhost:8080/projekt4git/webresources/register";

        $http({
            url: url,
            method: "POST",
            data:data
        }).then(function (data) {
            console.log("Du är registrerad");
            $rootScope.isRegistrerad = true;
            $rootScope.user = username;
            $rootScope.pass = password;
        },function(data){
            alert("Testa med ett annat användarnamn eller försök igen senare!");
           console.log("Du kan inte registrera dig"); 
        });
    };
    
    this.addRecept = function (r_namn, instruktion, author, kategori, imglink) {
        var data = {
            r_namn:r_namn,
            instruktion:instruktion,
            author:author,
            kategori:kategori,
            imglink:imglink     
        };
        var url = "http://localhost:8080/projekt4git/webresources/Rec";
        var auth = "Basic " + window.btoa($rootScope.user + ":" + $rootScope.pass);
        $http({
            url: url,
            method: "POST",
            data:data,
            headers: {'Authorization': auth}
        }).then(function (data) {
            alert("Du har lagt till ett recept!Lägg nu till vilka ingredienser!");
            console.log("Du la till et recept");
            $rootScope.isRecept = true;
        },function(data){
            alert("xD");
           console.log("du la inte till ett recept"); 
        });
    };
    
    
});

