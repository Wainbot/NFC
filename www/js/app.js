angular.module('NFC', ['ionic', 'NFC.services', 'nfcFilters', 'ngCordova'])

    .controller('AppController', function ($rootScope, $scope, nfcService, REST) {
        REST.getListBuildings()
            .then(function (response) {
                $scope.buildings = response.buildings;
                $scope.buildings.forEach(function (val) {
                    val.img = 'http://10.0.2.5/rest/image/' + val.imageid;
                });
            }, function (error) {
                $rootScope.error = error;
            });

        nfcService.getNFC()
            .then(function () {
                $scope.nfcIsEnabled = true;

                $scope.clear = function () {
                    nfcService.clearTag().then(function (response) {
                        $scope.tag = response;
                    });
                };

                nfcService.tag.then(function (response) {
                    $scope.tag = response;

                    REST.getBuilding($scope.tag.id)
                        .then(function (response) {
                            $scope.building = response;
                            $scope.building.img = val.img = 'http://10.0.2.5/rest/image/' + $scope.building.imageid;
                            $scope.building.levels.forEach(function (val) {
                                val.img = 'http://10.0.2.5/rest/image/' + val.imageid;
                            });
                        }, function (error) {
                            $rootScope.error = error;
                        });
                });
            }, function () {
                $scope.nfcIsEnabled = false;
            });
    });