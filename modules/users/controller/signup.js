angular.module('myApp')
    .factory('UsersService', UsersService)
    .factory('Authentication', Authentication)
    .factory('PasswordValidator', PasswordValidator)
    .controller('SignupController', SignupController)

PasswordValidator.$inject = ['$window'];
Authentication.$inject = ['$window'];
UsersService.$inject = ['$resource'];
SignupController.$inject = ['$scope', '$state', 'UsersService', '$location', '$window', 'Authentication', 'PasswordValidator', 'Notification', '$document', '$http', '$rootScope'];



function SignupController($scpoe, $state, UsersService, $location, $window, Authentication, PasswordValidator, Notification, $document, $http, $rootScope) {
    // get dom nav top
    var queryResult = $document[0].getElementById('navbar-top');
    var wrappedQueryResult = angular.element(queryResult);
    var vm = this;

    vm.authentication = Authentication;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    vm.signup = signup;
    vm.signin = signin;
    vm.callOauthProvider = callOauthProvider;
    vm.usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;
    if (!vm.authentication.user) {
        // hidden nav top
        // document.getElementById('main').classList.remove('section-wrapper');
        // document.getElementById('topbar').style.display = 'none';
        wrappedQueryResult.css('display', 'none');
    } else {
        // document.getElementById('main').classList.add('section-wrapper');
        wrappedQueryResult.css('display', 'block');
    }

    // var mb = document.getElementById('warp-signin-mobile');
    // var lg = document.getElementById('warp-signin-lg');
    // if (lg || mb) {
    //   if (screen.width >= 1239) {
    //     mb.parentNode.removeChild(mb);
    //   } else if (screen.width <= 1239) {
    //     lg.parentNode.removeChild(lg);
    //   }
    // }

    // Get an eventual error defined in the URL query string:
    // if ($location.search().err) {
    //   Notification.error({ message: $location.search().err });
    // }
    var currentLocation = window.location.href;
    var err = currentLocation.substring(currentLocation.search('/exit-email') + 12);
    if (err === 'Email%20already%20exists') {
        Notification.error({ message: 'Email Already Exits' });
    }
    // If user is signed in then redirect back home
    if (vm.authentication.user) {
        $location.path('/');
    }

    function signup(isValid) {

        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

            return false;
        }

        UsersService.userSignup(vm.credentials)
            .then(onUserSignupSuccess)
            .catch(onUserSignupError);
    }

    function signin(isValid) {
        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'vm.userForm');
            return false;
        }
        UsersService.userSignin(vm.credentials)
            .then(onUserSigninSuccess)
            .catch(onUserSigninError);
    }

    // OAuth provider request
    function callOauthProvider(url) {
        if ($state.previous && $state.previous.href) {
            url += '?redirect_to=' + encodeURIComponent($state.previous.href);
        }
        // Effectively call OAuth authentication route:
        $window.location.href = url;
    }

    // Authentication Callbacks

    function onUserSignupSuccess(response) {
        localStorage.setItem('accToken', response.token);
        // If successful we assign the response to the global user model
        vm.authentication.user = response;
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Signup successful!' });
        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
        $state.go('home', $state.previous.params);
        window.location.href = '/first-dashboards';
    }

    function onUserSignupError(response) {
        Notification.error({ message: response.data.message, title: '<i class="ic-close"></i> Signup Error!', delay: 6000 });
    }

    function onUserSigninSuccess(response) {
        // display nav top
        wrappedQueryResult.css('display', 'block');
        // If successful we assign the response to the global user model

        vm.authentication.user = response;
        // var encryptedData = CryptoJS.AES.encrypt(angular.toJson(value), secretKey).toString();
        localStorage.setItem('accToken', response.token);
        // accToken.value = JSON.stringify(response.token);
        // console.log(accToken.value);
        // userToken.setAccToken(response.token);
        // console.log(userToken);
        // And redirect to the previous or home page
        // $state.go($state.previous.state.name || 'home', $state.previous.params);
        // $state.go('home', $state.previous.params);
        window.location.href = '/first-dashboard';
    }

    function onUserSigninError(response) {
        console.log(response);
        Notification.error({ message: response.data.message, title: '<i class="ic-close"></i> Signin Error!', delay: 6000 });
    }

}

function PasswordValidator($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    var service = {
        getResult: getResult,
        getPopoverMsg: getPopoverMsg
    };

    return service;

    function getResult(password) {
        var result = owaspPasswordStrengthTest.test(password);
        return result;
    }

    function getPopoverMsg() {
        var popoverMsg = 'Please enter a passphrase or password with ' + owaspPasswordStrengthTest.configs.minLength + ' or more characters, numbers, lowercase, uppercase, and special characters.';

        return popoverMsg;
    }
}

function Authentication($window) {
    var auth = {
        user: $window.user
    };

    return auth;
}
function UsersService($resource) {
    var Users = $resource('/api/users', {}, {
        update: {
            method: 'PUT'
        },
        updatePassword: {
            method: 'POST',
            url: '/api/users/password'
        },
        deleteProvider: {
            method: 'DELETE',
            url: '/api/users/accounts',
            params: {
                provider: '@provider'
            }
        },
        sendPasswordResetToken: {
            method: 'POST',
            url: '/api/auth/forgot'
        },
        resetPasswordWithToken: {
            method: 'POST',
            url: '/api/auth/reset/:token'
        },
        signup: {
            method: 'POST',
            url: '/api/auth/signup'
        },
        signin: {
            method: 'POST',
            url: '/api/auth/signin'
        },
        mylabSignin: {
            method: 'POST',
            url: '/api/auth/mylabsignin'
        }
    });

    angular.extend(Users, {
        changePassword: function (passwordDetails) {
            return this.updatePassword(passwordDetails).$promise;
        },
        removeSocialAccount: function (provider) {
            return this.deleteProvider({
                provider: provider // api expects provider as a querystring parameter
            }).$promise;
        },
        requestPasswordReset: function (credentials) {
            return this.sendPasswordResetToken(credentials).$promise;
        },
        resetPassword: function (token, passwordDetails) {
            return this.resetPasswordWithToken({
                token: token // api expects token as a parameter (i.e. /:token)
            }, passwordDetails).$promise;
        },
        userSignup: function (credentials) {
            return this.signup(credentials).$promise;
        },
        userSignin: function (credentials) {
            return this.signin(credentials).$promise;
        },
        mylabAuth: function (credentials) {
            return this.mylabSignin(credentials).$promise;
        }
    });

    return Users;
}