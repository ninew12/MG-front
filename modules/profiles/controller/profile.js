angular
.module('myApp') 
.controller('ProfileController', ['$translate', 'authService', '$uibModal', '$scope', '$http', 'URL_API',
function ($translate, authService, $uibModal, $scope, $http, URL_API) {
	const userdata = JSON.parse(localStorage.getItem('userdata'));
	$scope.lang = $translate.use();
	$scope.loaded = true;
	if (userdata) {
		authService.ensureAuthenticated(userdata)
		.then((user) => {
			if (user.data.status === 'success');
			$scope.isLoggedIn = true;
		})
		.catch((err) => {
		});
	}

	$scope.favExpt = function (exptsId){
		$http.put(URL_API + '/api/v1/users/favorite/' + userdata._id, {
			action: '$pull',
			expertId: exptsId
		}).then(function(res){
			$http({method: 'GET', url: URL_API + '/api/v1/users/'+ userdata._id, 
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'platform': 'web',
                'lang': $translate.use(),
				'x-access-token': userdata.accessToken,
				'x-user': userdata.email,
				'Authorization': 'Basic c2Vuc2Vpbm86U2Vuc2Vpbm9AMjAxNw=='
			}
			}).then( function(res){
				localStorage.setItem('userdata', JSON.stringify(res.data.data.profile));
		 		window.location.reload(true);
			});
		}, function(err) {
		});
			
	};
		$scope.user = userdata;
		// console.log($scope.user);
	
	$scope.editPost = function(){
		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'editPost.html',
			controller: 'EditPostModalController as ctrl',
			windowClass: 'app-modal-window',
			resolve : { 
				expertsId : function() {
				   return $scope.user.experts[0]._id;
				},

			}
			});
	};
}]);

angular
.module('myApp')
.controller('EditPostModalController', function ($translate, URL_API, $http, $scope, $uibModal, $uibModalInstance, expertsId) {
	// document.getElementsByClassName("modal-dialog ").style.width = '800px';
	// var result = document.getElementsByClassName("modal-dialog ");
	// console.log(result);
	// for (var i = 0; i = result.length; i++) {
	// 	console.log(result);
    //     result[i].style.width = "800px";
    // }
	// console.log(result);
	$scope.lang = $translate.use();
	$scope.filesArray = [];
	$scope.portMediaArray = [];
	$http.get(URL_API + '/api/v1/experts/' + expertsId )
	.then( function(res){
		$scope.expt = res.data.data[0];
		$http.get(URL_API + '/api/v1/tags?jobType=' + $scope.expt.jobType._id)
		.then(function (res) {
			$scope.tags = res.data.data;
		});
		for(var i = 0; i<$scope.expt.profileImg.length; i ++){
			$scope.filesArray.push($scope.expt.profileImg[i].url);
		}
		for(var i = 0; i<$scope.expt.portfolio.length; i ++){
			$scope.portMediaArray.push($scope.expt.portfolio[i].url);
		}
		// console.log($scope.expt);
		
	});
	$http.get(URL_API + '/api/v1/job_types')
	.then(function (res) {
		$scope.loaded = true;
		$scope.jobTypes = res.data.data;
	
	});

	$scope.removePreImg = function(item) {
		$scope.filesArray.splice(item, 1);   
	}
	$scope.removePortImg = function(item) {
		$scope.portMediaArray.splice(item, 1);   
	}
	
	$scope.selectjob = function () {
		$http.get(URL_API + '/api/v1/tags?jobType=' + $scope.expt.jobType._id)
			.then(function (res) {
				$scope.tags = res.data.data;
			});
	};
	$scope.picToApi = [];
	$scope.uploadFile = function(e){
		var files = e[0];
		$scope.picToApi.push(files);
		var fd = new FormData();
		fd.append('pic', files);
		$http.post(URL_API + '/api/v1/upload',fd, {
			transformRequest: angular.identity,
			headers: {
				'Content-Type': undefined,
				'platform': 'web',
				'lang': $translate.use(),
				"Authorization": 'Basic c2Vuc2Vpbm86U2Vuc2Vpbm9AMjAxNw=='
			}
		}).then(function (res) {
			$scope.filesArray.push(res.data.data.url);
		}, function (err) {
			console.log(err.data);
		});
	};
	$scope.portToApi = [];
	
	$scope.uploadPort = function(e){
		var files = e[0];
		$scope.portToApi.push(files);
		var fd = new FormData();
		fd.append('pic', files);
		$http.post(URL_API + '/api/v1/upload',fd, {
			transformRequest: angular.identity,
			headers: {
				'Content-Type': undefined,
				'platform': 'web',
				'lang': $translate.use(),
				"Authorization": 'Basic c2Vuc2Vpbm86U2Vuc2Vpbm9AMjAxNw=='
			}
		}).then(function (res) {
			$scope.portMediaArray.push(res.data.data.url);
		}, function (err) {
			console.log(err.data);
		});
	};
	$scope.submitEditPost = function() {
		$scope.expt.name['cn'] = $scope.expt.name[$scope.lang];
		$scope.expt.name['en'] = $scope.expt.name[$scope.lang];
		$scope.expt.name['jp'] = $scope.expt.name[$scope.lang];
		$scope.expt.name['kr'] = $scope.expt.name[$scope.lang];
		$scope.expt.name['th'] = $scope.expt.name[$scope.lang];
		$scope.expt.detail['cn'] = $scope.expt.detail[$scope.lang];
		$scope.expt.detail['en'] = $scope.expt.detail[$scope.lang];
		$scope.expt.detail['jp'] = $scope.expt.detail[$scope.lang];
		$scope.expt.detail['kr'] = $scope.expt.detail[$scope.lang];
		$scope.expt.detail['th'] = $scope.expt.detail[$scope.lang];
		$scope.expt.education['cn'] = $scope.expt.education[$scope.lang];
		$scope.expt.education['en'] = $scope.expt.education[$scope.lang];
		$scope.expt.education['jp'] = $scope.expt.education[$scope.lang];
		$scope.expt.education['kr'] = $scope.expt.education[$scope.lang];
		$scope.expt.education['th'] = $scope.expt.education[$scope.lang];
		$scope.expt.experience['cn'] = $scope.expt.experience[$scope.lang];
		$scope.expt.experience['en'] = $scope.expt.experience[$scope.lang];
		$scope.expt.experience['jp'] = $scope.expt.experience[$scope.lang];
		$scope.expt.experience['kr'] = $scope.expt.experience[$scope.lang];
		$scope.expt.experience['th'] = $scope.expt.experience[$scope.lang];
		if($scope.filesArray.length === 0){
			$scope.picErr = true;		
		}else {
			$http.put(URL_API + '/api/v1/experts/'+ expertsId , {
				name: $scope.expt.name,
				jobType: $scope.expt.jobType._id,
				tag: $scope.expt.tag._id,
				price: $scope.expt.price,
				priceType: $scope.expt.priceType,
				detail:  $scope.expt.detail,
				experience: $scope.expt.experience,
				education:  $scope.expt.education,
				pic: $scope.filesArray,
				portfolio: $scope.portMediaArray

			}).then(function(res){
				window.location.reload(true);
			}, function(err) {
				$scope.err = true;
				$scope.errmsg = err.data.description;

			});
		}
	

	};
	$scope.closeMD = function() {
		$uibModalInstance.close(false);
	};
	
});