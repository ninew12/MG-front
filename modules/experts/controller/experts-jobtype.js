
angular
.module('myApp')
.controller('ExpertsJobtypeController', ['$translate', 'authService', '$scope', '$http', 'URL_API',
function ($translate, authService, $scope, $http, URL_API) {
    $scope.lang = $translate.use();
    var currenturl = window.location.href;
    var jobTypesId = currenturl.substring(currenturl.search('/jobtype-experts')+ 16);
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
        console.log(lang);
		$scope.imglang = 'assets/img/flag_' + lang + '.png';
        $scope.lang = lang;
        $translate.use(lang);
    };
    $scope.tagArr = [];
    $scope.tagId = [];
	$http.get(URL_API + '/api/v1/experts?jobType=' + jobTypesId + '&sortValue=-1')
	.then( function(res){
        $scope.loaded = true;
        $scope.experts = res.data.data;
        console.log($scope.experts);
        for(var i = 0; i < $scope.experts.length; i++){
            $scope.tagId.push($scope.experts[i].tag._id);
        }
        var items = $scope.tagId;
        var uniqueItems = Array.from(new Set(items));
        for(var i = 0; i < $scope.experts.length; i++){
            if($scope.experts[i].tag._id === uniqueItems[i]){
                $scope.tagArr.push($scope.experts[i].tag);
            } else {

            }
        }
    });
    $scope.tagfil = function (id){
        if(id === 'all'){
            document.getElementById('all').getElementsByTagName('span')[0].className += " tag-active";
            for(var i = 0; i<$scope.tagArr.length; i++){
                if($scope.tagArr[i]._id !== document.getElementById('all') ){
                    document.getElementById($scope.tagArr[i]._id).getElementsByTagName('span')[0].classList.remove("tag-active");
                }
            };
            $http.get(URL_API + '/api/v1/experts?jobType=' + jobTypesId )
            .then( function(res){
                $scope.loaded = true;
                $scope.experts = res.data.data;
            });
        } else {
            for(var i = 0; i<$scope.tagArr.length; i++){
                if($scope.tagArr[i]._id !== id ){
                    document.getElementById($scope.tagArr[i]._id).getElementsByTagName('span')[0].classList.remove("tag-active");
                }
            };
            document.getElementById('all').getElementsByTagName('span')[0].classList.remove("tag-active");
            document.getElementById(id).getElementsByTagName('span')[0].className += " tag-active";
            $http.get(URL_API + '/api/v1/experts?jobType=' + jobTypesId + '&tag=' + id +'&sortValue=-1')
            .then( function(res){
                $scope.loaded = true;
                $scope.experts = res.data.data;
            });
        }
       
    }
}]);

