
angular
.module('myApp')
.controller('TopbarController', ['$translate', '$http', 'URL_API', '$scope', '$uibModal',
function ($translate, $http, URL_API, $scope, $uibModal) {
	const userdata = JSON.parse(localStorage.getItem('userdata'));
	$scope.authen = userdata;
	// console.log($scope.authen);
	if($scope.authen!=null){
		if($scope.authen.imgUrl===null && $scope.authen.experts!=null  && $scope.authen.experts[0]){
			if($scope.authen.experts[0].profileImg.length != 0){
				$scope.imgProTopbar = $scope.authen.experts[0].profileImg[0].url;
			} else{
				$scope.imgProTopbar = $scope.authen.experts[0].thumbImgUrl;
			}
			
		} else {
			$scope.imgProTopbar = $scope.authen.imgUrl;
		}
	}
	$scope.lang = $translate.use();
	
		$http.get('multilingual.json') 
		.then(function (data) {
			$scope.multilingual = data.data
		}, function (error) {
		});

	$scope.regis = function() {
		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'regisModal.html',
			controller: 'RegisModalController as ctrl'
			});
	};
	$scope.searchAPI = function() {
		$http.post(URL_API + '/api/v1/search', {textSearch: $scope.keyword})
		.then(function(res){
			localStorage.setItem('search',JSON.stringify([$scope.keyword, res.data.data]));
			window.location.href = '/#/search';
			window.location.reload()
		}, function(err) {
		});;

	};
	$scope.logout = function(){
		$http({
			method: 'POST',
			url: URL_API + '/api/v1/users/logout',
			data: {
				email: userdata.email
			},
			headers: {
				'Content-Type': 'application/json',
				'platform': 'web',
                'lang': $translate.use(),
				'Authorization': 'Basic c2Vuc2Vpbm86U2Vuc2Vpbm9AMjAxNw=='
			}
		}).then(function(res){
			window.localStorage.clear();
			window.location.reload(true);
		}, function(err) {
		});
	};
	$scope.loginModal = function() {
		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'loginModal.html',
			controller: 'RegisModalController as ctrl'
			});
	};
	$scope.jobsexpressModal = function() {
		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: '่jobsexpressModal.html',
			controller: 'JobsexpressModalController as ctrl'
			});
	};
}]);

angular
.module('myApp')
.controller('RegisModalController', function ($translate, authService, $location, URL_API, $http, $scope, $uibModal, $uibModalInstance) {
	
	$scope.submitEmailLogin = function(){
		authService.LoginByEmail($scope.login.username, $scope.login.password)
		.then((user) => {
			$http.get(URL_API + '/api/v1/users/'+user.data.data._id)
			.then( function(res){
			});
			$http({method: 'GET', url: URL_API + '/api/v1/users/'+user.data.data._id, 
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'platform': 'web',
                'lang': $translate.use(),
				'x-access-token': user.data.data.accessToken,
				'x-user': user.data.data.email,
				'Authorization': 'Basic c2Vuc2Vpbm86U2Vuc2Vpbm9AMjAxNw=='
			}
			}).then( function(res){
				localStorage.setItem('userdata', JSON.stringify(res.data.data.profile));
		 		window.location.reload(true);
			});
		})
		.catch((err) => {
		  $scope.loginerr = true;
		  if(err.data.description!= null){
			$scope.loginerrmsg = err.data.description;
		  } else {
			$scope.loginerrmsg = err.data;
		  }
		});
	};
	
	$scope.submitEmailRegis = function() {

		authService.RegisByEmail($scope.user.firstname, $scope.user.lastname, $scope.user.tel, $scope.user.email, $scope.user.password)
		.then((user) => {
		  localStorage.setItem('userdata', JSON.stringify(user.data.data));
		  window.location.reload(true);
		})
		.catch((err) => {
		  $scope.err = true;
		  $scope.errmsg = err.data.description;
		});
  };
	$scope.FBbtnLogin = function() {
        FB.init({
            appId: '1668838553138058',
            status: true,
            cookie: true,
            xfbml: true,
            version: 'v2.4'
        });
  
        FB.login(function(response) {
            $scope.authres = response.authResponse;
            if (response.authResponse) {
                FB.api('/me?fields=id,name,email,first_name,last_name,age_range,picture.type(large)', function(response) {
                    $scope.prores = response;
                    $http({
                        method: 'POST',
                        url: URL_API + '/api/v1/users/login',
                        data: {
                            username: $scope.authres.userID,
                            type: 'facebook',
                            credential: $scope.authres.accessToken,
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            'platform': 'web',
							'lang': $translate.use(),
                            'Authorization': 'Basic c2Vuc2Vpbm86U2Vuc2Vpbm9AMjAxNw=='
                        }
                    }).then( function(res){
                        $http({method: 'GET', url: URL_API + '/api/v1/users/'+ res.data.data._id,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
								'x-access-token': res.data.data.accessToken,
								'platform': 'web',
								'lang': $translate.use(),
                                'x-user': res.data.data.email,
                                'Authorization': 'Basic c2Vuc2Vpbm86U2Vuc2Vpbm9AMjAxNw=='
                            }
                        }).then( function(res){
                            localStorage.setItem('userdata', JSON.stringify(res.data.data.profile));
                            // window.location.href = '/#/';
                            location.reload(true);
                        });
                    }, function(err) {
						console.log(err);
						if(err.status === 404){
							$scope.loginerrmsg = err.data.description;
						}
                        $scope.loginerr = true;
                    });
                });
            } else {
            }
        });
    };
  $scope.FBbtnRegis = function() {
	FB.init({ 
        appId: '1668838553138058',
        status: true, 
        cookie: true, 
        xfbml: true,
        version: 'v2.4'
	});
	FB.login(function(response) {
		$scope.authres = response.authResponse;
		if (response.authResponse) {
		 FB.api('/me?fields=id,name,email,first_name,last_name,age_range,picture.type(large)', function(response) {
		   $scope.prores = response;
             $scope.FBdata = { authres: $scope.authres, prores: $scope.prores }
             if($scope.prores.email === null || $scope.prores.email === undefined){
                 $uibModalInstance.close(false);
                 var modalInstance = $uibModal.open({
                     animation: $scope.animationsEnabled,
                     templateUrl: 'regisFBwithEmail.html',
                     controller: 'RegisFBwithEmailModal as ctrl',
                     resolve : {
                         FBdata : function() {
                             return $scope.FBdata;
                         }
                     }
                 });
			 } else {
                 $http({
                     method: 'POST',
                     url: URL_API + '/api/v1/users/register',
                     data: {
                         firstName: $scope.prores.first_name,
                         lastName: $scope.prores.last_name,
                         mobileNo: '',
                         email: $scope.prores.email,
                         imgUrl: $scope.prores.picture.data.url,
                         socialId: $scope.authres.userID,
                         socialToken: $scope.authres.accessToken,
                         type: 'facebook'
                     },
                     headers: {
                         'Content-Type': 'application/json',
                         'platform': 'web',
						 'lang': $translate.use(),
                         'Authorization': 'Basic c2Vuc2Vpbm86U2Vuc2Vpbm9AMjAxNw=='
                     }
                 }).then( function(res){
                 }, function(err) {
                     $scope.loginerr = true;
                     $scope.errmsg = err.data.description;

                 });
			 }

		 });
		} else {
		}
	});
  };

	$scope.closeMD = function() {
		$uibModalInstance.close(false);
	};
	$scope.regis = function() {
		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'regisModal.html',
			controller: 'RegisModalController as ctrl'
			});
	};
	$scope.regisEmail = function() {
		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'regisEmailModal.html',
			controller: 'RegisModalController as ctrl'
		});
	};
	$scope.loginModal = function() {
		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'loginModal.html',
			controller: 'RegisModalController as ctrl'
			});
	};
	$scope.scrollTo = function(id) {
		$location.hash(id);
		$anchorScroll();
	 }
});

angular
.module('myApp')
.controller('JobsexpressModalController', function ($translate, $scope, $uibModal, $uibModalInstance, $http, URL_API) {
	$scope.lang = $translate.use();
	$http.get(URL_API + '/api/v1/job_types')
	.then( function(res){
				$scope.jobTypes = res.data.data;
	});
	$scope.selectjob = function () {
		$http.get(URL_API + '/api/v1/tags?jobType=' + $scope.datajob._id)
		.then( function(res){
				$scope.tags = res.data.data;
		});
	};
	$scope.submitJobExpress = function() {
		$http.post(URL_API + '/api/v1/jobs', {
			name: $scope.postex.name,
			jobType: $scope.datajob._id,
			tag: $scope.datatag._id,
			price: $scope.postex.price,
            priceType: $scope.postex.jobunit,
            detail: $scope.postex.des,
            type: 'urgent',
						mobileNo: $scope.postex.tel,
						lineId: $scope.postex.line
		}).then(function(res){
			window.location.reload(true);
		}, function(err) {
			$scope.err = true;
			$scope.errmsg = err.data.description;
			
    });

	};
	$scope.closeMD = function() {
		$uibModalInstance.close(false);
	};
	
});

angular
    .module('myApp')
    .controller('RegisFBwithEmailModal', function ($translate, $scope, $uibModal, $uibModalInstance, $http, URL_API, FBdata) {
        $scope.lang = $translate.use();
        $scope.regisFBcon = function () {
            $http({
                method: 'POST',
                url: URL_API + '/api/v1/users/register',
                data: {
                    firstName: FBdata.prores.first_name,
                    lastName: FBdata.prores.last_name,
                    mobileNo: '',
                    email: $scope.email,
                    imgUrl: FBdata.prores.picture.data.url,
                    socialId: FBdata.authres.userID,
                    socialToken: FBdata.authres.accessToken,
                    type: 'facebook'
                },
                headers: {
                    'Content-Type': 'application/json',
                    'platform': 'web',
					'lang': $translate.use(),
                    'Authorization': 'Basic c2Vuc2Vpbm86U2Vuc2Vpbm9AMjAxNw=='
                }
            }).then( function(res){
                $http({
                    method: 'POST',
                    url: URL_API + '/api/v1/users/login',
                    data: {
                        username:res.data.data._id,
                        type: 'facebook',
                        credential: res.data.data.accessToken,
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'platform': 'web',
						'lang': $translate.use(),
                        'Authorization': 'Basic c2Vuc2Vpbm86U2Vuc2Vpbm9AMjAxNw=='
                    }
                }).then( function(res){
                    $http({method: 'GET', url: URL_API + '/api/v1/users/'+ res.data.data._id,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
							'x-access-token': res.data.data.accessToken,
							'platform': 'web',
							'lang': $translate.use(),
                            'x-user': res.data.data.email,
                            'Authorization': 'Basic c2Vuc2Vpbm86U2Vuc2Vpbm9AMjAxNw=='
                        }
                    }).then( function(res){
                        localStorage.setItem('userdata', JSON.stringify(res.data.data.profile));
                        window.location.href = '/#/';
                    });
                }, function(err) {
                });
            }, function(err) {
                $scope.loginerr = true;
                $scope.loginerrmsg = err.data.description;
            });
        };


        $scope.closeMD = function() {
            $uibModalInstance.close(false);
        };

    });