# linkin
Micro Library for authenticate with Oauth2 by Linkedin for Angular apps. Prepared to work in web and mobile platforms(Cordova, Ionic, etc).

## Installation

Download the js file from this repo and add it to your html:

```html
<script src=".../linkin.js"></script>
```

## Usage

Set `linkin` in your module dependencies and config your application fields.
```js
angular.module('MyApp', ['linkin'])
  .config(function(LinkinProvider) {
    LinkinProvider.setConfig('CLIENT_ID',['SCOPE'], 'STATE');
    if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
      LinkinProvider.setRedirectUri('http://localhost/');
      LinkinProvider.setPlatform('mobile');
    }
  });
```

**Note:** For default the backend url is the same host where is your angularapp, but you can customize it with: 

```js
LinkinProvider.setBackendUrl("BACKEND_URL");
```

Then, in your controller, inject `Linkin` and you'll use the `authenticate` method for jump the popup of linkedin authorization, get your auth code and send this to your backend for get the token access.

```js
angular.module('MyApp')
  .controller('LoginCtrl', function($scope, Linkin) {
    $scope.authenticate() = function(){
      Linkin.authenticate().then(function(result){
        //Getting the response from your backend for make your own workflow
      }, function(error){
        //Error
      });
    };
  });
```

```html
<button ng-click="authenticate()">Sign in with LinkedIn</button>
```

**Note:** You can find an example of the backend side in the files of this repo.