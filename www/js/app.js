angular.module('NFC', ['ionic', 'NFC.services', 'nfcFilters', 'ngCordova'])
    .constant('apiUrl', 'http://vps.jeremyfroment.fr:3002/rest')
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .controller('AppController', function ($rootScope, $scope, $ionicModal, nfcService, REST, apiUrl) {
        $scope.tag = {id: null};

        REST.getListBuildings()
            .then(function (response) {
                $scope.buildings = response.buildings;
                $scope.buildings.forEach(function (val) {
                    val.img = apiUrl + '/image/' + val.imageid;
                });
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
                    $scope.setTagByBuilding($scope.tag.id);
                });
            }, function () {
                $scope.nfcIsEnabled = false;
            });

        $scope.setTagByBuilding = function (id) {
            $scope.tag.id = id;
            REST.getBuilding($scope.tag.id)
                .then(function (response) {
                    $scope.building = response;
                    $scope.building.img = apiUrl + '/image/' + $scope.building.imageid;
                    $scope.building.levels.forEach(function (val) {
                        val.img = apiUrl + '/image/' + val.imageid;
                    });
                });
        };

        $ionicModal.fromTemplateUrl('modal-level.html', function ($ionicModal) {
            $scope.modal = $ionicModal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });
    });