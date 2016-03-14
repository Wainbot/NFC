angular.module('NFC.services', [])
    .service('REST', function (Request) {
        var url = '/rest';

        return {
            getListBuildings: function () {
                return Request.send({
                    method: 'GET',
                    url: url + '/building'
                });
            },
            addBuilding: function () {
                return Request.send({
                    method: 'POST',
                    url: url + '/building',
                    data: {}
                });
            },
            updateBuilding: function (tagid) {
                return Request.send({
                    method: 'PUT',
                    url: url + '/building/' + tagid,
                    data: {}
                });
            },
            deleteBuilding: function (tagid) {
                return Request.send({
                    method: 'DELETE',
                    url: url + '/building/' + tagid
                });
            },
            getBuilding: function (tagid) {
                return Request.send({
                    method: 'GET',
                    url: url + '/building/' + tagid
                });
            },
            addLevel: function (tagid) {
                return Request.send({
                    method: 'POST',
                    url: url + '/building/' + tagid,
                    data: {}
                });
            },
            updateLevel: function (tagid, level) {
                return Request.send({
                    method: 'PUT',
                    url: url + '/building/' + tagid + '/' + level,
                    data: {}
                });
            },
            deleteLevel: function (tagid, level) {
                return Request.send({
                    method: 'DELETE',
                    url: url + '/building/' + tagid + '/' + level
                });
            },
            getLevel: function (tagid, level) {
                return Request.send({
                    method: 'GET',
                    url: url + '/building/' + tagid + '/' + level
                });
            }
        };
    })
    .service('Request', function ($http, $q) {
        return {
            send: function (req) {
                var deferred = $q.defer();

                $http(req).then(function (response) {
                    console.log(response);
                    deferred.resolve(response);
                }, function (error) {
                    console.error(error);
                    deferred.reject(error);
                });

                return deferred.promise;
            }
        };
    })
    .factory('nfcService', function ($rootScope, $ionicPlatform, $cordovaDialogs, $q) {
        var tag = {};

        $ionicPlatform.ready(function () {
            nfc.addNdefListener(function (nfcEvent) {
                $cordovaDialogs.beep(1);
                console.log(JSON.stringify(nfcEvent.tag, null, 4));
                $rootScope.$apply(function () {
                    angular.copy(nfcEvent.tag, tag);
                });
            }, function () {
                console.log("Listening for NDEF Tags.");
            }, function (reason) {
                //alert("Error adding NFC Listener " + reason);
            });
        });

        return {
            tag: tag,

            clearTag: function () {
                angular.copy({}, this.tag);
            },
            getNFC: function () {
                var deferred = $q.defer();
                $ionicPlatform.ready(function () {
                    nfc.enabled(
                        function () {
                            deferred.resolve(true);
                        },
                        function () {
                            deferred.reject(false);
                        }
                    );
                });
                return deferred.promise;
            }
        };
    });