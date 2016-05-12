angular.module('NFC.services', [])

    /**
     * Service REST pour executer les requêtes Rest
     */
    .service('REST', function (Request, apiUrl) {
        return {

            /**
             * Retourne la liste des bâtiments
             *
             * @returns {*}
             */
            getListBuildings: function () {
                return Request.send({
                    method: 'GET',
                    url: apiUrl
                });
            },

            /**
             * Retourne le bâtiment passé en paramètre
             *
             * @param tagid
             * @returns {*}
             */
            getBuilding: function (tagid) {
                return Request.send({
                    method: 'GET',
                    url: apiUrl + '/' + tagid
                });
            },

            /**
             * Retourne l'étage passé en paramètre
             *
             * @param tagid
             * @param level
             * @returns {*}
             */
            getLevel: function (tagid, level) {
                return Request.send({
                    method: 'GET',
                    url: apiUrl + '/' + tagid + '/' + level
                });
            }
        };
    })

    /**
     * Service Request pour factoriser les requêtes Rest
     */
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

    /**
     * Factory nfcService pour la gestion de la technologie nfc
     */
    .factory('nfcService', function ($rootScope, $ionicPlatform, $cordovaDialogs, $q) {
        var hexChar = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

        function byteToHex(b) {
            return hexChar[(b >> 4) & 0x0f] + hexChar[b & 0x0f];
        }

        function EncodTag(tag) {
            var hexa = "";
            tag.id.forEach(function (val) {
                hexa += byteToHex(val).toLowerCase();
            });
            tag.id = hexa.trim();

            return tag
        }

        $ionicPlatform.ready(function () {
            nfc.enabled(
                function () {
                    $rootScope.$broadcast('nfcEnabled', "nfc is enabled");
                    nfc.addNdefListener(function (nfcEvent) {
                        $cordovaDialogs.beep(1);
                        $rootScope.$broadcast('tagScanned', EncodTag(nfcEvent.tag));
                    }, function () {
                        //console.log("Listening for NDEF Tags.");
                    }, function (reason) {
                        //console.log("Error adding NFC Listener " + reason);
                    });
                },
                function () {
                    $rootScope.$broadcast('nfcEnabled', "nfc is not enabled");
                }
            );
        });

        return {};
    });