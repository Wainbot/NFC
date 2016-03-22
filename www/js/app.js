angular.module('NFC', ['ionic', 'NFC.services', 'nfcFilters', 'ngCordova'])

    .controller('AppController', function ($rootScope, $scope, nfcService, REST) {
        REST.getListBuildings()
            .then(function (response) {
                $scope.buildings = response.buildings;
            }, function (error) {
                $rootScope.error = error;
            });

        nfcService.getNFC()
            .then(function () {
                $scope.nfcIsEnabled = true;

                $scope.clear = function () {
                    nfcService.clearTag().then(function(response) {
                        $rootScope.toto = response;
                        $scope.tag = response;
                    });
                };

                nfcService.tag.then(function(response) {
                    $rootScope.toto = response;
                    $scope.tag = response;
                    REST.getBuilding($scope.tag.id)
                        .then(function (response) {
                            $scope.building = response;
                        }, function (error) {
                            $rootScope.error = error;
                        });
                });
            }, function () {
                $scope.nfcIsEnabled = false;
            });
    });