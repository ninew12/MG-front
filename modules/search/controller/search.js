
angular
.module('myApp') 
.directive('myEnter', function () {
return function (scope, element, attrs) {
	element.bind('keydown keypress', function (event) {
	if (event.which === 13) {
		scope.$apply(function () {
		scope.$eval(attrs.myEnter);
		});
		event.preventDefault();
		event.currentTarget.value = "";
	}
	});
};
})
.controller('SearchController', ['$translate', 'authService', '$uibModal', '$scope', '$http', 'URL_API',
function ($translate, authService, $uibModal, $scope, $http, URL_API) {
	var searchData = JSON.parse(localStorage.getItem('search'));
	const userdata = JSON.parse(localStorage.getItem('userdata'));
	$scope.lang = $translate.use();
	$scope.imglang = 'assets/img/flag_' + $scope.lang + '.png';
	$scope.loaded = true;
	$scope.qnull = false;
	if(searchData[1].experts.length === 0){
		$scope.qnull = true;
		$scope.keyword = searchData[0];
		$scope.expertdata = '';
		$scope.jobdata = '';
	} else {
		$scope.keyword = searchData[0];
		$scope.expertdata = searchData[1].experts;
		$scope.jobdata = searchData[1].jobs;
	}
	if (userdata) {
		authService.ensureAuthenticated(userdata)
		.then((user) => {
			if (user.data.status === 'success');
			$scope.isLoggedIn = true;
		})
		.catch((err) => {
		});
	}
	$scope.chgLang = function (lang){
		$scope.imglang = 'assets/img/flag_' + lang + '.png';
		$scope.lang = lang;
		$translate.use(lang);
	};
	$scope.favExpt = function (exptsId, check){
		if($scope.isLoggedIn){
			if(check === true){
				$http.put(URL_API + '/api/v1/users/favorite/' + userdata._id, {
					action: '$pull',
					expertId: exptsId
				}).then(function(res){
				}, function(err) {
				});
			} else {
				$http.put(URL_API + '/api/v1/users/favorite/' + userdata._id, {
					action: '$push',
					expertId: exptsId
				}).then(function(res){
				}, function(err) {
				});
			}
			
		} else {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'loginModal.html',
				controller: 'RegisModalController as ctrl'
			});
		}
	};
	$scope.jobsModal = function (jobid){
		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'jobModalHome.html',
			controller: 'JobsModalController as ctrl',
			resolve: {
				jobid: function() {
					return jobid;
				}
				}
			});
	};
}]);

