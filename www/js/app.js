angular.module('NFC', ['ionic', 'NFC.services', 'nfcFilters', 'ngCordova'])
    .constant('apiUrl', 'http://10.0.2.5/rest')
    .run(function ($ionicPlatform, $interval) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }

            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            function checkConnection() {
                var networkState = navigator.connection.type;

                var states = {};
                states[Connection.UNKNOWN] = 'Unknown connection';
                states[Connection.ETHERNET] = 'Ethernet connection';
                states[Connection.WIFI] = 'WiFi connection';
                states[Connection.CELL_2G] = 'Cell 2G connection';
                states[Connection.CELL_3G] = 'Cell 3G connection';
                states[Connection.CELL_4G] = 'Cell 4G connection';
                states[Connection.CELL] = 'Cell generic connection';
                states[Connection.NONE] = 'No network connection';

                alert('Connection type: ' + states[networkState]);
            }

            $interval(function () {
                checkConnection();
            }, 5000);

            document.addEventListener("offline", function () {
                // Handle the offline event
                alert('you are offline');
            }, false);
        });
    })

    .controller('AppController', function ($rootScope, $scope, nfcService, REST, apiUrl) {
        $scope.setTagByBuilding = function (id) {
            $scope.tag.id = id;
            REST.getBuilding($scope.tag.id)
                .then(function (response) {
                    $scope.building = response;
                    $scope.building.img = val.img = apiUrl + '/image/' + $scope.building.imageid;
                    $scope.building.levels.forEach(function (val) {
                        val.img = 'http://10.0.2.5/rest/image/' + val.imageid;
                    });
                }, function (error) {
                    $rootScope.error = error;
                });
        };

        REST.getListBuildings()
            .then(function (response) {
                $scope.buildings = response.buildings;
                $scope.buildings.forEach(function (val) {
                    val.img = apiUrl + '/image/' + val.imageid;
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
                            $scope.building.img = val.img = apiUrl + '/image/' + $scope.building.imageid;
                            $scope.building.levels.forEach(function (val) {
                                val.img = apiUrl + '/image/' + val.imageid;
                            });
                        }, function (error) {
                            $rootScope.error = error;
                        });
                });
            }, function () {
                $scope.nfcIsEnabled = false;
            });
    });