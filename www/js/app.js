angular.module('NFC', ['ionic', 'NFC.services', 'nfcFilters', 'ngCordova'])

    .controller('AppController', function ($rootScope, $scope, nfcService, REST) {
        REST.getListBuildings()
            .then(function (response) {
                $scope.buildings = response;
            }, function (error) {
                $rootScope.error = error;
            });

        nfcService.getNFC()
            .then(function () {
                $scope.nfcIsEnabled = true;
                $scope.tag = nfcService.tag;

                $scope.clear = function () {
                    nfcService.clearTag();
                };

                //REST.getBuilding($scope.tag.id)
                //    .then(function (response) {
                //        $scope.building = response;
                //    }, function (error) {
                //        $rootScope.error = error;
                //    });
            }, function () {
                $scope.nfcIsEnabled = false;
            });
    });