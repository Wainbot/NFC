angular.module('NFC', ['ionic', 'nfcFilters', 'ngCordova'])

    .controller('AppController', function ($scope, nfcService) {
        $scope.tag = nfcService.tag;
        $scope.clear = function () {
            nfcService.clearTag();
        };
    })

    .factory('nfcService', function ($rootScope, $ionicPlatform, $cordovaDialogs) {
        var tag = {};

        $ionicPlatform.ready(function () {
            nfc.addNdefListener(function (nfcEvent) {
                $cordovaDialogs.beep(3);
                console.log(JSON.stringify(nfcEvent.tag, null, 4));
                $rootScope.$apply(function () {
                    angular.copy(nfcEvent.tag, tag);
                });
            }, function () {
                console.log("Listening for NDEF Tags.");
            }, function (reason) {
                alert("Error adding NFC Listener " + reason);
            });

        });

        return {
            tag: tag,

            clearTag: function () {
                angular.copy({}, this.tag);
            }
        };
    });