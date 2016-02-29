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
    });