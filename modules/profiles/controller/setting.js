angular
.module('myApp') 
.controller('SettingController', ['$translate', 'authService', '$uibModal', '$scope', '$http', 'URL_API', '$timeout',
function ($translate, authService, $uibModal, $scope, $http, URL_API, $timeout) {
	console.log('SettingController');
	const userdata = JSON.parse(localStorage.getItem('userdata'));
	$scope.lang = $translate.use();
	$scope.loaded = true;
	
	$scope.filesArray = [];
	if (userdata) {
		authService.ensureAuthenticated(userdata)
		.then((user) => {
			if (user.data.status === 'success');
			$scope.isLoggedIn = true;
		})
		.catch((err) => {
			console.log(err);
		});
	}
	$http.get(URL_API + '/api/v1/banks')
	.then(function (res) {
		$scope.bank = res.data.data;
	});
	$scope.uploadFile = function(e){
		var files = e[0];
		// $scope.portToApi.push(files);
		var $reader = new FileReader();
		$reader.onload = function (e) {
			var result = e.target.result;
			// console.log(result);
			$scope.filesArray.push(result);
			$scope.$apply();
		}
		$reader.readAsDataURL(files);
	};
	// $scope.user.bankAccount = 'Bangkok Bank';
	$scope.removeFile = function(item) {
		$scope.filesArray.splice(item, 1);   
	};
	$scope.updateProfile = function() {
		// if(document.getElementById('newpass').value == document.getElementById('conpass').value){
		// 	console.log(document.getElementById('passOld').value);
		// 	console.log(document.getElementById('newpass').value);
		// 	$http.post(URL_API + '/api/v1/users/changePass', {
		// 		oldPassword: document.getElementById('passOld').value,
		// 		newPassword: document.getElementById('newpass').value
		// 	}).then(function (res) {
		// 		// console.log(res);
		// 		$scope.succmsg = res.data.description;
		// 		$scope.msgsucc = false;
		// 		$timeout(function() {
		// 			$scope.msgsucc = true;
		// 		 }, 3000);
		// 	}, function (err) {
		// 		$scope.errmsg = err.data.description;
		// 		$scope.msgerr = false;
		// 		$timeout(function() {
		// 			// $scope.err = true;
		// 			$scope.msgerr = true;
		// 		 }, 3000);
		// 		// console.log(err.data);

		// 	});
		// }
		// else {

		// }
	};
	$scope.submitChangePass = function() {
		if(document.getElementById('newpass').value == document.getElementById('conpass').value){
			console.log(document.getElementById('passOld').value);
			console.log(document.getElementById('newpass').value);
			$http.post(URL_API + '/api/v1/users/changePass', {
				oldPassword: document.getElementById('passOld').value,
				newPassword: document.getElementById('newpass').value
			}).then(function (res) {
				// console.log(res);
				$scope.succmsg = res.data.description;
				$scope.msgsucc = false;
				$timeout(function() {
					$scope.msgsucc = true;
				 }, 3000);
			}, function (err) {
				$scope.errmsg = err.data.description;
				$scope.msgerr = false;
				$timeout(function() {
					// $scope.err = true;
					$scope.msgerr = true;
				 }, 3000);
				// console.log(err.data);

			});
		}
		else {

		}
	};
	$scope.checkMatchPass = function() {
		if (document.getElementById('newpass').value == document.getElementById('conpass').value) {
			document.getElementById('conmessage').style.color = 'green';
			document.getElementById('conmessage').innerHTML = '';
		} else {
				document.getElementById('conmessage').style.color = 'red';
			document.getElementById('conmessage').innerHTML = 'รหัสผ่านไม่ตรงกัน';
		}
	}


	$scope.user = userdata;
	console.log($scope.user);
}]);

