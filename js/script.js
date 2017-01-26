/* global $rootScope */

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
    }).state("addingrediens", {
        url: "/addingrediens",
        templateUrl: "templates/addingrediens.html",
        controller:"addingrediensCtrl"
    });
});

module.controller("homeCtrl", function ($scope, ReceptService,$rootScope) {
        $scope.deleteRec = function (id,author){
            if($rootScope.user === author){
                return ReceptService.deleteRec(id);

            } else {
                alert("Inte ditt recept bror");
                console.log("recepter tillhör " +author);
            }
            
            
   };
      
    var promise = ReceptService.getTable();
    promise.then(function (data) {
        console.log(data.data);
        $scope.table = data.data;
    });
    
    var promise = ReceptService.getRec_Ing();
    promise.then(function (data) {
        console.log(data.data);
        $scope.Rec_Ing = data.data;
    });
    
    $scope.open = function (index){
        
        var namn, bild, instruktion, kategori;
        namn = $scope.table[index].r_namn;
        bild = $scope.table[index].imglink;
        instruktion = $scope.table[index].instruktion;
        author = $scope.table[index].author;
        kategori = $scope.table[index].kategori;

        document.querySelector('.results').innerHTML = '<h1>'+namn+'</h1><img src='+bild+'><p>Kategori: '+kategori+'</p><p>Instruktion: '+instruktion+'</p><p>Av användare: '+author+'</p>';
        var promise = ReceptService.getRec_Ing($scope.table[index].recept_id);
        
        promise.then(function (data){
            $scope.ingredienser = data.data;
            $scope.receptShow = true;
        });
            
    };
});

module.controller("addingrediensCtrl", function ($scope, $rootScope, ReceptService) {    

     var promise = ReceptService.getIng();
    promise.then(function (data) {
        console.log("Ingredienser"+data.data);
        $scope.Ing = data.data;
    });
    var promise = ReceptService.getLastRec();
    promise.then(function (data) {
        console.log("lastrec"+data.data);
        $rootScope.LastRec = data.data;
    });
    
    
    $scope.addRec_Ing = function () {
        ReceptService.addRec_Ing(Number($scope.i_id),$scope.amount,$rootScope.LastRec[0].recept_id,$scope.i_namn);
    };

   
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
    
    this.getLastRec = function () {
        var deffer = $q.defer();
        var url = "http://localhost:8080/projekt4git/webresources/LastRec";
        $http.get(url).then(function (data) {
            deffer.resolve(data);
        });
        return deffer.promise;
    };
    
    this.getRec_Ing = function (id) {
        var deffer = $q.defer();
        var url = "http://localhost:8080/projekt4git/webresources/Rec_Ing/"+id;
        $http.get(url).then(function (data) {
            deffer.resolve(data);
        });
        return deffer.promise;
    };
    
    this.getIng = function () {
        var deffer = $q.defer();
        var url = "http://localhost:8080/projekt4git/webresources/ing";
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
           alert("Fel vid inlogg!");
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
            alert("Du kan nu logga In");
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
            author:$rootScope.user,
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
            console.log("Du la till et recept");
            $rootScope.isRecept = true;
            
        },function(data){
           console.log("du la inte till ett recept"); 
        });
        console.log($rootScope.user);
    };
    
    this.addRec_Ing = function (i_id,amount,i_namn) {
        console.log(i_id);
        console.log(amount);
        console.log($rootScope.LastRec[0].recept_id);
        var data = {
            r_id:$rootScope.LastRec[0].recept_id,
            i_id:i_id,
            amount:amount
        };
        var url = "http://localhost:8080/projekt4git/webresources/Rec_Ing";
        var auth = "Basic " + window.btoa($rootScope.user + ":" + $rootScope.pass);
        $http({
            url: url,
            method: "POST",
            data:data,
            headers: {'Authorization': auth}
        }).then(function (data) {
            console.log("Du la till en ingrediens");
            document.querySelector('.resultsIng').innerHTML = 'Du har lagt till ingrediensen med id: '+i_id+'';
        },function(data){
           console.log("du la inte till en ingrediens"); 
        });
    };
    
    this.deleteRec = function (id){
            var url = "http://localhost:8080/projekt4git/webresources/rec/"+id;
            
        var auth = "Basic " + window.btoa($rootScope.user + ":" + $rootScope.pass);
        
        $http({
            url: url,
            method: "DELETE",
            headers: {'Authorization': auth}
            
        }).success(function (data, status) {
            console.log("Recept borttagen");
        }).error(function (data, status) {
            console.log("det blev fel vid radering");
        });
        
    };

    
    
});

