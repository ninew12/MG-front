
angular
.module('myApp')
.directive('carousel', function($timeout) {
	return {
	   restrict: 'E',
	   scope: {
		 links: '=' 
	   },
	   templateUrl: 'carousel.html',
	   link: function(scope, element) {
		 $timeout(function() {
		   $('.carousel-indicators li',element).first().addClass('active');
		   $('.carousel-inner .item',element).first().addClass('active');
		 });
	   }
	}
 })
.filter('getDistance', function(){
	return function(locate){
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position){
				this.latme = position.coords.latitude;
				this.lonme = position.coords.longitude;
				if(locate===null){
					this.latex = '';
					this.lonex = '';
				} else {
					this.latex = locate.lat;
					this.lonex = locate.lon;
				}
			});
		}
		function calcCrow(lat1, lon1, lat2, lon2) 
		{
			var R = 6371; // km
			var dLat = toRad(lat2-lat1);
			var dLon = toRad(lon2-lon1);
			var lat1 = toRad(lat1);
			var lat2 = toRad(lat2);
	
			var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
			var d = R * c;
			return d;
		}
		function toRad(Value) 
		{
			return Value * Math.PI / 180;
		}
	   return Math.trunc(calcCrow(this.latme, this.lonme, this.latex, this.lonex)); 
	}
 })
.controller('HomeController', ['$translate', 'authService', '$uibModal', '$scope', '$http', 'URL_API', '$location', '$anchorScroll',
function ($translate, authService, $uibModal, $scope, $http, URL_API, $location, $anchorScroll) {
	$scope.lang = $translate.use();
	$scope.imglang = 'assets/img/flag_' + $scope.lang + '.png';
	$scope.bannersarr = [];
	$scope.banner = {};
	$scope.experts = [];
	$scope.isLoggedIn = false;
	$scope.favexptId = [];
	var currenturl = window.location.href;
	// console.log(currenturl);
	$scope.chgLang = function (lang){
		$scope.imglang = 'assets/img/flag_' + lang + '.png';
		$scope.lang = lang;
		$translate.use(lang);
		
	};
	var line = currenturl.substring(currenturl.search('/?state=lineCallback&response='));
	if(currenturl.indexOf("/?state=lineCallback&response=") > -1){
		var responseUrl = line.substring(28);
		var delHash = responseUrl.slice(0, -2);
		// console.log(decodeURI(delHash));
		$scope.lineData = decodeURI(delHash);
		// console.log($scope.lineData);
		var obj = JSON.parse($scope.lineData);
		var resline = obj.data;
		// console.log(resline);
		$http({
			method: 'POST',
			url: URL_API + '/api/v1/users/login',
			data: { 
				username:resline.userId,
				type: 'line',
				credential: resline.accessToken,
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
					'platform': 'web',
					'lang': $translate.use(),
					'x-access-token': res.data.data.accessToken,
					'x-user': res.data.data.email,
					'Authorization': 'Basic c2Vuc2Vpbm86U2Vuc2Vpbm9AMjAxNw=='
				}
				}).then( function(res){
					localStorage.setItem('userdata', JSON.stringify(res.data.data.profile));
					 window.location.href = '/#/';
				});
			}, function(err) {
				// console.log(err);
				var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'lineLoginModal.html',
				controller: 'LineLoginModal as ctrl',
				resolve : { 
					lineData : function() {
					return $scope.lineData;
					}
				}
				});
			});
	}
	
	$scope.slickConfig = {
    enabled: true,
    autoplay: true,
    draggable: false,
    autoplaySpeed: 3000,
    method: {},
    event: {
        beforeChange: function (event, slick, currentSlide, nextSlide) {
        },
        afterChange: function (event, slick, currentSlide, nextSlide) {
        }
    }
};
	const userdata = JSON.parse(localStorage.getItem('userdata'));
	if (userdata) {
	  authService.ensureAuthenticated(userdata)
	  .then((user) => {
		if (user.data.status === 'success');
		$scope.isLoggedIn = true;
	  })
	  .catch((err) => {
		// console.log(err);
	  });
	}

	$scope.backtotop = function() {
		// set the location.hash to the id of
		// the element you wish to scroll to.
		$location.hash('top');

		// call $anchorScroll()
		$anchorScroll();
	};
	
	$scope.favExpt = function (exptsId, check){
		if($scope.isLoggedIn){
			// console.log(exptsId);
			if(check === true){
				$http.put(URL_API + '/api/v1/users/favorite/' + userdata._id, {
					action: '$pull',
					expertId: exptsId
				}).then(function(res){
					// console.log(res.data);
				}, function(err) {
					// console.log(err.data);
				});
			} else {
				$http.put(URL_API + '/api/v1/users/favorite/' + userdata._id, {
					action: '$push',
					expertId: exptsId
				}).then(function(res){
					// console.log(res.data);
				}, function(err) {
					// console.log(err.data);
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
	$http.get(URL_API + '/api/v1/page/foryou')
	.then( function(res){
		// console.log(res.data.data.experts);
		$scope.loaded = true;
		$scope.banners = res.data.data.banners;
		// console.log(res.data.data);
		for(var i = 0; i < $scope.banners.length; i++){
			$scope.banner = {src:$scope.banners[i].webImgUrl};
			$scope.bannersarr.push($scope.banner);
		}
		$scope.experts = res.data.data.experts;
		// console.log($scope.experts);
		$scope.slidesex = $scope.experts[0].experts[0].thumbImgUrl;
		$scope.jobTypes = res.data.data.jobTypes;
		$scope.jobs = res.data.data.jobs;
	});
	$http.get(URL_API + '/api/v1/page/expert')
	.then( function(res){
		$scope.loaded = true;
		$scope.jobTypesRow = [{}];
		$scope.jobTypes = res.data.data.jobTypes;
	});
	$scope.jobsModal = function (jobdata){
		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'jobModalHome.html',
			controller: 'JobsModalController as ctrl',
			resolve: {
				jobdata: function() {
					return jobdata;
				}
				}
			});
	};

}]);


angular
.module('myApp')
.controller('LineLoginModal', function ($translate, $scope, $uibModal, $uibModalInstance, $http, URL_API, lineData) {
	// console.log('LineLoginModal');
	$scope.lang = $translate.use();
	$scope.regisLine = function () {
		var obj = JSON.parse(lineData);
		var resline = obj.data;
		$http({
		method: 'POST',
		url: URL_API + '/api/v1/users/register',
		data: { 
			firstName: resline.displayName,
			lastName: '',
			mobileNo: '',
			email: $scope.email,
			imgUrl: resline.pictureUrl,
			socialId: resline.userId,
			socialToken: resline.accessToken,
			type: 'line'
		},
		headers: {
			'Content-Type': 'application/json',
			'platform': 'web',
			'lang': $translate.use(),
			'Authorization': 'Basic c2Vuc2Vpbm86U2Vuc2Vpbm9AMjAxNw=='
		}
		}).then( function(res){
			// console.log(res);
		}, function(err) {
			// console.log(err);
		});
	};
	
	
	$scope.closeMD = function() {
		$uibModalInstance.close(false);
	};
	
});