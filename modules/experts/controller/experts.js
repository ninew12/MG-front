
angular
.module('myApp')
.controller('ExpertsController', ['$translate', '$uibModal', 'authService', '$scope', '$http', 'URL_API',
function ($translate, $uibModal, authService, $scope, $http, URL_API) {
	$scope.lang = $translate.use();
	$scope.imglang = 'assets/img/flag_' + $scope.lang + '.png';
	$scope.isLoggedIn = false;
	const userdata = JSON.parse(localStorage.getItem('userdata'));
	
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
	$scope.exptCre = function (){
		if($scope.isLoggedIn){
			window.location.href = '/#/experts-create'
		} else {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'loginModal.html',
				controller: 'RegisModalController as ctrl'
			});
		}
	};
	$http.get(URL_API + '/api/v1/page/expert')
	.then( function(res){
		$scope.loaded = true;
		$scope.jobTypesRow = [{}];
		$scope.jobTypes = res.data.data.jobTypes;
		$scope.experts = res.data.data.experts;
		// console.log($scope.jobTypes);
	});
	
}]);

