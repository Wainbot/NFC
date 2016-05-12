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

    /**
     * Configuration pour récupérer les requêtes http
     *
     * Dans notre cas, incrémentation/décrémentation dans la variable isLoading du nombre de requêtes
     * http afin d'afficher un loader ou de bloquer des boutons lorsque des requêtes sont en cours
     */
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push(['$rootScope', function ($rootScope) {
            $rootScope.isLoading = 0;
            return {
                'request': function (config) {
                    $rootScope.isLoading++;
                    return config;
                },
                'requestError': function (rejection) {
                    $rootScope.isLoading = Math.max(0, $rootScope.isLoading - 1);
                    return rejection;
                },
                'response': function (response) {
                    $rootScope.isLoading = Math.max(0, $rootScope.isLoading - 1);
                    return response;
                },
                'responseError': function (rejection) {
                    $rootScope.isLoading = Math.max(0, $rootScope.isLoading - 1);
                    return rejection;
                }
            };
        }]);
    }])

    /**
     * Contrôleur de l'application
     */
    .controller('AppController', function ($rootScope, $scope, $ionicModal, nfcService, REST, apiUrl) {
        $scope.nfcIsEnabled = false;
        $scope.tag = {id: null};
        $scope.building = {};

        REST.getListBuildings()
            .then(function (response) {
                $scope.buildings = response.buildings;
            });

        $rootScope.$on('nfcEnabled', function (event, message) {
            $scope.nfcIsEnabled = true;
        });

        $rootScope.$on('tagScanned', function (event, tag) {
            $scope.tag = tag;
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
                });
        };
    });