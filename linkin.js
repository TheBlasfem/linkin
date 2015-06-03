/**
 * Linkin 0.0.1
 * (c) 2015 Julio lopez
 * License: MIT
 */
(function(window, angular, undefined) {
  'use strict';

  angular.module('Linkin', []).provider('Oauth2', Oauth2);

  function Oauth2(){
    var authWindow, exchangingAuthForToken, deferred, clientId, backendUrl;
    var redirectUri = window.location.origin || window.location.protocol + '//' + window.location.host;
    var platform = "browser";
    var providerscope = [];
    var state = "STATE";
    var backendUrl = redirectUri + "/auth/linkedin";
    return {
      setConfig: function(clientid, scope, c_state){
        clientId = clientid;
        providerscope = scope;
        state = c_state;
      },
      setBackendUrl: function(v){
        backendUrl = v;
      },
      setRedirectUri: function(v) {
        redirectUri = v;
      },
      setPlatform: function(v) {
        platform = v;
      },
      $get: ['$http', '$q', '$interval', function($http, $q, $interval){

        var linkedinCallback = function(e){
          var url = (typeof e.url !== 'undefined' ? e.url : e.originalEvent.url);
          var codes = /\?code=(.+)&state=(.+)$/.exec(url);
          var error = /\?error=(.+)$/.exec(url);

          if (codes || error) {
            //Always close the browser when match is found
            authWindow.close();
          }

          if (codes) {
            //Exchange the authorization code for an access token
            exchangingAuthForToken(codes);
          } else if (error) {
            //The user denied access to the app
            deferred.reject({
              error: error[1]
            });
          }
        };

        exchangingAuthForToken = function(codes){
          $http.post(backendUrl, {
            code: codes[1],
            state: codes[2],
            client_id: clientId,
            redirect_uri: redirectUri
          }).success(function(data, status, headers, config) {
            deferred.resolve(data, status, headers, config);
          }).error(function(data) {
            deferred.reject(data.responseJSON);
          });
        };

        var pollPopUp = function(){
          var polling;
          var deferred = $q.defer();

          polling = $interval(function(){

            try{
              var documentOrigin = document.location.host;

              if (authWindow.location.host === documentOrigin){
                var url = authWindow.location.href;
                var codes = /\?code=(.+)&state=(.+)$/.exec(url);
                var error = /\?error=(.+)$/.exec(url);

                if (codes){
                  exchangingAuthForToken(codes);
                } else if (error) {
                  //The user denied access to the app
                  deferred.reject({
                    error: error[1]
                  });
                }

                authWindow.close();
                $interval.cancel(polling);
              }
            } catch (error){
            }

            if (!authWindow) {
              $interval.cancel(polling);
              deferred.reject({ data: 'Provider Popup Blocked' });
            } else if (authWindow.closed || authWindow.closed === undefined) {
              $interval.cancel(polling);
              deferred.reject({ data: 'Authorization Failed' });
            }
            
          }, 35);
        };

        return{
          authenticate: function(provider){
            deferred = $q.defer();
            if (provider == "linkedin"){
              var authUrl = 'https://www.linkedin.com/uas/oauth2/authorization?' + $.param({
                response_type: 'code',
                client_id: clientId,
                redirect_uri: redirectUri,
                state: state,
                scope: providerscope
              });

              authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');
              authWindow.addEventListener('loadstart', linkedinCallback);
              if (platform == "browser") pollPopUp();
            }
            return deferred.promise;
          }
        }
      }]
    };
  }
})();
