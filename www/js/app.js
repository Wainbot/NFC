angular.module('NFC', ['ionic', 'NFC.services', 'nfcFilters', 'ngCordova'])

    .controller('AppController', function ($rootScope, $scope, nfcService, REST) {
        nfcService.getNFC()
            .then(function () {
                $scope.nfcIsEnabled = true;
                $scope.tag          = nfcService.tag;

                $scope.clear = function () {
                    nfcService.clearTag();
                };

                REST.getBuilding($scope.tag)
                    .then(function (response) {
                        $scope.building = response;
                    });

            }, function () {
                $scope.nfcIsEnabled = false;
            });
    });