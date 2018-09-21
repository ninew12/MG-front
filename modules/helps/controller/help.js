
angular
.module('myApp')
.controller('HelpController', ['$translate', '$timeout', 'authService', '$uibModal', '$scope', '$http', 'URL_API',
function ($translate, $timeout, authService, $uibModal, $scope, $http, URL_API) {
	const userdata = JSON.parse(localStorage.getItem('userdata'));
	$scope.lang = $translate.use();
	$scope.imglang = 'assets/img/flag_' + $scope.lang + '.png';
	$scope.isLoggedIn = false;
	if (userdata) {
		authService.ensureAuthenticated(userdata)
		.then((user) => {
			if (user.data.status === 'success');
			$scope.isLoggedIn = true;
			$scope.loaded = true;
		})
		.catch((err) => {
			$scope.loaded = true;
		});
	}else {
		$scope.loaded = true;
	}
	$scope.jobspostModal = function() {
		if($scope.isLoggedIn){
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: '่jobspostModal.html',
				controller: 'JobspostModalController as ctrl'
				});
			
		} else {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'loginModal.html',
				controller: 'RegisModalController as ctrl'
			});
		}
	};
	$scope.chgLang = function (lang){
		$scope.imglang = 'assets/img/flag_' + lang + '.png';
		$scope.lang = lang;
		$translate.use(lang);
	};
	$scope.searchApiHelp = function() {
		$http.post(URL_API + '/api/v1/search', {textSearch: $scope.keywordhelp})
		.then(function(res){
			localStorage.setItem('search',JSON.stringify([$scope.keywordhelp, res.data.data]));
			window.location.href = '/#/search';
			window.location.reload()
		}, function(err) {
		});;

	};
	$http.get(URL_API + '/api/v1/faqs')
	.then( function(res){
        $scope.loaded = true;
        $scope.faqArr = res.data.data;
    });
	$scope.groups = [
		{
		  title: 'FAQ - 1',
		  content: 'คำตอบ รายละเอียดคำตอบรายละเอียด' +
		  'รายละเอียดคำตอบรายละเอียดรายละเอียดคำตอบ' + 
		  'รายละเอียดรายละเอียดคำตอบรายละเอียดรายละเอียด' + 
		  'รายละเอียดรายละเอียดคำตอบรายละเอียดรายละเอียด' + 
		  'รายละเอียดรายละเอียดคำตอบรายละเอียดรายละเอียด' + 
		  'รายละเอียดรายละเอียดคำตอบรายละเอียดรายละเอียด'
		},
		{
		  title: 'FAQ - 2',
		  content: 'Dynamic Group Body - 2'
		},
		{
		  title: 'FAQ - 3',
		  content: 'Dynamic Group Body - 3'
		},
		{
		  title: 'FAQ - 4',
		  content: 'Dynamic Group Body - 4'
		}
	  ];
}]);

