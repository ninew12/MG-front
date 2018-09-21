
angular
.module('myApp')
.controller('ExpertsDetailController', ['$translate', 'authService', '$scope', '$uibModal', '$http', 'URL_API',
function ($translate, authService, $scope, $uibModal, $http, URL_API) {
    $scope.lang = $translate.use();
    $scope.profilePicArr = [];
    $scope.loaded = false;
    var currenturl = window.location.href;
    var exid = currenturl.substring(currenturl.search('/experts-detail')+ 15);
    $scope.isLoggedIn = false;
    const userdata = JSON.parse(localStorage.getItem('userdata'));
     
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
    $scope.chatExpt = function (exptdetail) {
        if($scope.isLoggedIn){
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'hiMsg.html',
                controller: 'HimsgModalController as ctrl',
                resolve: {
                    exptdetail: function() {
                      return exptdetail;
                    }
                  }
            });
             
             
        } else {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'loginModal.html',
                controller: 'RegisModalController as ctrl'
            });
        }
    };
    $scope.imglang = 'assets/img/flag_' + $scope.lang + '.png';
    $scope.chgLang = function (lang){
        $scope.imglang = 'assets/img/flag_' + lang + '.png';
        $scope.lang = lang;
        $translate.use(lang);
    };
    $http.get(URL_API + '/api/v1/experts/' + exid)
    .then( function(res){
        $scope.loaded = true;
        $scope.exptdetail = res.data.data[0];
        // console.log($scope.exptdetail);
        $scope.exptID = $scope.exptdetail._id;
        $scope.exptUserId = $scope.exptdetail.user._id;
        $scope.profilePic = $scope.exptdetail.profileImg;
        for(var i = 0; i < $scope.profilePic.length; i++){
            $scope.profilePicAdapt = {src:$scope.profilePic[i].url};
            $scope.profilePicArr.push($scope.profilePicAdapt);
        }   
    });
    $scope.favExpt = function (exptsId, check){
        if($scope.isLoggedIn){
            console.log(exptsId);
            if(check === true){
                $http.put(URL_API + '/api/v1/users/favorite/' + userdata._id, {
                    action: '$pull',
                    expertId: exptsId
                }).then(function(res){
                    console.log(res.data);
                }, function(err) {
                    console.log(err.data);
                });
            } else {
                $http.put(URL_API + '/api/v1/users/favorite/' + userdata._id, {
                    action: '$push',
                    expertId: exptsId
                }).then(function(res){
                    console.log(res.data);
                }, function(err) {
                    console.log(err.data);
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
    $scope.imgExpand = function(data){
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'imgfull.html',
            controller: 'ViewImgCtrl as ctrl',
            windowClass: 'img-modal-window',
            backdrop: true,
            resolve: {
                data: function() {
                  return data;
                },
              }
        });
    }
    $scope.seeReviewModal = function(review) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'seeReviewModal.html',
            controller: 'SeeReviewModalController as ctrl',
            resolve: {
                review: function() {
                  return review;
                },
              }
        });
    };
}]);
angular
.module('myApp')
.controller('ViewImgCtrl', function ($scope, $uibModal, $uibModalInstance, data) {
    // console.log('ViewImgCtrl');
    // console.log(data);
    $scope.imgview = data;
    $scope.closeMD = function() {
        $uibModalInstance.close(false);
    };
     
});
angular
.module('myApp')
.controller('SeeReviewModalController', function ($scope, $uibModal, $uibModalInstance, review) {
    // console.log('ReviewModalController');
    // console.log(review);
    $scope.reviews = review
    $scope.closeMD = function() {
        $uibModalInstance.close(false);
    };
     
});
angular
.module('myApp')
.controller('HimsgModalController', function ($translate, $scope, $uibModal, $uibModalInstance, exptdetail, $http, URL_API) {
    $scope.lang = $translate.use();
    // console.log('HimsgModalController');
    const userdata = JSON.parse(localStorage.getItem('userdata'));
    $scope.exptdata = exptdetail
    $scope.sendMsg = function () {
        $http.post(URL_API + '/api/v1/rooms', 
            {
                employerId : userdata._id,
                expertId: exptdetail._id,
                expertUserId: exptdetail.user._id,
                message: $scope.msgsend,
                createBy : "employer"
            }).then(function (res) {
                    $uibModalInstance.close(false);
                    window.location.href = '/#/chat'
                }, function (err) {
                    if(err.data.code === 40022){
                        $uibModalInstance.close(false);
                        window.location.href = '/#/chat'
                    }else{
                        console.log(err.data);
                    }
            });
    };
     
    $scope.closeMD = function() {
        $uibModalInstance.close(false);
    };
     
});