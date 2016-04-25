angular.module('NFC.services', [])
    .service('REST', function (Request) {
        var url = 'http://vps251441.ovh.net:3002/rest';

        return {
            getListBuildings: function () {
                return Request.send({
                    method: 'get',
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

                $http(req)
                    .success(function (response) {
                        console.log(response);
                        deferred.resolve(response);
                    })
                    .error(function (error) {
                        console.error(error);
                        deferred.reject(error);
                    });

                return deferred.promise;
            }
        };
    })
    .factory('nfcService', function ($rootScope, $ionicPlatform, $cordovaDialogs, $q) {
        var hexChar = ["0", "1", "2", "3", "4", "5", "6", "7","8", "9", "A", "B", "C", "D", "E", "F"];

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
                    tag.id.forEach(function(val) {
                        hexa += byteToHex(val).toLowerCase();
                    });
                    tag.id = hexa.trim();
                    deferred.resolve(tag);
                });
            }, function () {
                console.log("Listening for NDEF Tags.");
            }, function (reason) {
                //alert("Error adding NFC Listener " + reason);
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
                            alert("NFC good !!!");
                            deferred.resolve(true);
                        },
                        function () {
                            alert("NFC not good !!!");
                            deferred.reject(false);
                        }
                    );
                });
                return deferred.promise;
            }
        };
    });