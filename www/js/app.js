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
        $scope.nfcIsEnabled = false;
        $scope.tag = { id: null };
        $scope.building = {};

        REST.getListBuildings()
            .then(function (response) {
                $scope.buildings = response.buildings;
                //$scope.buildings.forEach(function (val) {
                //    val.img = apiUrl + '/image/' + val.imageid;
                //});
            });

        $rootScope.$on('nfcEnabled', function (event, message) {
            //alert(message);
            $scope.nfcIsEnabled = true;
        });

        $rootScope.$on('tagScanned', function (event, tag) {
            $scope.tag = tag;
            //alert($scope.tag.id);
            $scope.setTagByBuilding($scope.tag.id);
        });

        $scope.clear = function () {
            $scope.tag = {};
        };

        $scope.setTagByBuilding = function (id) {
            $scope.tag.id = id;
            REST.getBuilding($scope.tag.id)
                .then(function (response) {
                    $scope.building = response;
                    //$scope.building.img = apiUrl + '/image/' + $scope.building.imageid;
                    //$scope.building.levels.forEach(function (val) {
                    //    val.img = apiUrl + '/image/' + val.imageid;
                    //});
                });
        };

        $ionicModal.fromTemplateUrl('modal-level.html', function ($ionicModal) {
            $scope.modal = $ionicModal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        $scope.openModal = function (level) {
            REST.getLevel($scope.building.tag, level)
                .then(function (response) {
                    $scope.modal.show();
                    $scope.modal.level = response;
                    //$scope.modal.level.img = apiUrl + '/image/' + $scope.modal.level.imageid;
                });
        };
    });