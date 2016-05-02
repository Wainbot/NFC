angular.module('NFC.services', [])
    .service('REST', function (Request, apiUrl) {

        return {
            getListBuildings: function () {
                return Request.send({
                    method: 'GET',
                    url: apiUrl
                });
            },
            addBuilding: function () {
                return Request.send({
                    method: 'POST',
                    url: apiUrl,
                    data: {}
                });
            },
            updateBuilding: function (tagid) {
                return Request.send({
                    method: 'PUT',
                    url: apiUrl + '/' + tagid,
                    data: {}
                });
            },
            deleteBuilding: function (tagid) {
                return Request.send({
                    method: 'DELETE',
                    url: apiUrl + '/' + tagid
                });
            },
            getBuilding: function (tagid) {
                return Request.send({
                    method: 'GET',
                    url: apiUrl + '/' + tagid
                });
            },
            addLevel: function (tagid) {
                return Request.send({
                    method: 'POST',
                    url: apiUrl + '/' + tagid,
                    data: {}
                });
            },
            updateLevel: function (tagid, level) {
                return Request.send({
                    method: 'PUT',
                    url: apiUrl + '/' + tagid + '/' + level,
                    data: {}
                });
            },
            deleteLevel: function (tagid, level) {
                return Request.send({
                    method: 'DELETE',
                    url: apiUrl + '/' + tagid + '/' + level
                });
            },
            getLevel: function (tagid, level) {
                return Request.send({
                    method: 'GET',
                    url: apiUrl + '/' + tagid + '/' + level
                });
            }
        };
    })
    .service('Request', function ($http, $q, $rootScope) {
        return {
            send: function (req) {
                var deferred = $q.defer();

                $http(req)
                    .then(function (response) {
                        deferred.resolve(response.data);
                    }, function (error) {
                        $rootScope.error = error;
                        deferred.reject(error);
                    });

                return deferred.promise;
            }
        };
    })
    .factory('nfcService', function ($rootScope, $ionicPlatform, $cordovaDialogs, $q) {
        var hexChar = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

        function byteToHex(b) {
            return hexChar[(b >> 4) & 0x0f] + hexChar[b & 0x0f];
        }

        var tag = {};
        var deferred = $q.defer();

        $ionicPlatform.ready(function () {
            nfc.addNdefListener(function (nfcEvent) {
                $cordovaDialogs.beep(1);
                $rootScope.$apply(function () {
                    angular.copy(nfcEvent.tag, tag);
                    var hexa = "";
                    tag.id.forEach(function (val) {
                        hexa += byteToHex(val).toLowerCase();
                    });
                    tag.id = hexa.trim();
                    deferred.resolve(tag);
                });
            }, function () {
                console.log("Listening for NDEF Tags.");
            }, function (reason) {
                console.log("Error adding NFC Listener " + reason);
            });
        });

        return {
            tag: deferred.promise,

            clearTag: function () {
                var def = $q.defer();

                angular.copy({}, this.tag);

                def.resolve(this.tag);

                return def.promise;
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