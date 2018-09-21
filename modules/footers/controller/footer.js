
angular
.module('myApp')
.controller('FooterController', ['$translate', '$timeout', 'authService', '$uibModal', '$scope', '$http', 'URL_API',
function ($translate, $timeout, authService, $uibModal, $scope, $http, URL_API) {
	$scope.lang = $translate.use();

    // $scope.termModal = function() {
	// 	var modalInstance = $uibModal.open({
	// 		animation: $scope.animationsEnabled,
	// 		templateUrl: 'terms-service.html',
	// 		controller: 'FooterController as ctrl'
	// 		});
    // };
    // $scope.policyModal = function() {
	// 	var modalInstance = $uibModal.open({
	// 		animation: $scope.animationsEnabled,
	// 		templateUrl: 'policy.html',
	// 		controller: 'FooterController as ctrl'
	// 		});
	// };
	// $scope.chgLang = function (lang){
	// 	$scope.imglang = 'assets/img/flag_' + lang + '.png';
	// 	$scope.lang = lang;
	// 	$translate.use(lang);
	// };
	$http.get(URL_API + '/api/v1/faqs')
	.then( function(res){
        $scope.loaded = true;
        $scope.faqArr = res.data.data;
    });
}]);

