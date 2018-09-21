
angular
.module('myApp')
.controller('JobsController', ['$translate', 'authService', '$scope', '$uibModal', '$http', 'URL_API',
function ($translate, authService, $scope, $uibModal, $http, URL_API) {
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
        console.log(err);
      });
    }
    $scope.chgLang = function (lang){
        $scope.imglang = 'assets/img/flag_' + lang + '.png';
        $scope.lang = lang;
        $translate.use(lang);
    };
    $http.get(URL_API + '/api/v1/page/job')
    .then( function(res){
        $scope.loaded = true;
        $scope.jobTypes = res.data.data.jobTypes;
        $scope.jobs = res.data.data.jobs;
    });
    $scope.jobsModal = function (jobdata){
        if($scope.isLoggedIn){
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'jobModal.html',
                controller: 'JobsModalController as ctrl',
                resolve: {
                    jobdata: function() {
                        return jobdata;
                    }
                    }
                });
        }
        else {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'loginModal.html',
                controller: 'RegisModalController as ctrl'
            });
        }
     
    };
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
 
}]);
 
angular
.module('myApp')
.controller('JobsModalController', function ($translate, URL_API, $http, $scope, $uibModal, jobdata, $uibModalInstance) {
    const userdata = JSON.parse(localStorage.getItem('userdata'));
    $scope.lang = $translate.use();
    $scope.id = jobdata._id;
    $http.get(URL_API + '/api/v1/jobs/'+ $scope.id)
    .then( function(res){
        $scope.jobdatas = res.data.data[0];
    });
    $scope.chatToEmployer = function (jobdatas) {
        if(userdata){
            $uibModalInstance.close(false);
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'hiMsg.html',
                controller: 'ChatJobCtrl as ctrl',
                resolve: {
                    jobdatas: function() {
                      return jobdatas;
                    }
                  }
            });
             
            console.log(jobdatas);
        } else {
            $uibModalInstance.close(false);
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'loginModal.html',
                controller: 'RegisModalController as ctrl'
            });
        }
    };
    $scope.closeMD = function() {
        $uibModalInstance.close(false);
    };
});
 
angular
.module('myApp')
.controller('JobspostModalController', function ($translate, URL_API, $http, $scope, $uibModal, $uibModalInstance) {
    $scope.lang = $translate.use();
    $http.get(URL_API + '/api/v1/job_types')
    .then( function(res){
                $scope.jobTypes = res.data.data;
                // console.log(res.data.data);
    });
    $scope.selectjob = function () {
        // console.log('selectjob');
        $http.get(URL_API + '/api/v1/tags?jobType=' + $scope.datajob._id)
        .then( function(res){
                $scope.tags = res.data.data;
                // console.log(res.data.data);
        });
    };
    $scope.submitPostJob = function() {
        // console.log($scope.postjob);
        // console.log($scope.datajob._id);
        // console.log($scope.datatag);
 
        $http.post(URL_API + '/api/v1/jobs', {
            name: $scope.postjob.name,
            jobType: $scope.datajob._id,
            tag: $scope.datatag._id,
            price: $scope.postjob.price,
            priceType: $scope.postjob.jobunit,
            detail: $scope.postjob.des,
            type: 'normal',
                        mobileNo: $scope.postjob.tel,
                        lineId: $scope.postjob.line
        }).then(function(res){
            window.location.href = '/#/jobs'
        }, function(err) {
            $scope.err = true;
            $scope.errmsg = err.data.description;
      console.log(err.data);
             
    });
 
    };
    $scope.closeMD = function() {
        $uibModalInstance.close(false);
    };
     
});
 
angular
.module('myApp')
.controller('ChatJobCtrl', function ($translate, $scope, $uibModal, $uibModalInstance, jobdatas, $http, URL_API) {
    $scope.lang = $translate.use();
    const userdata = JSON.parse(localStorage.getItem('userdata'));
    $scope.exptdata = jobdatas
    $scope.sendMsg = function () {
        $uibModalInstance.close(false);
        $http.post(URL_API + '/api/v1/rooms', 
            {
                employerId : jobdatas._id,
                expertId: userdata._id,
                expertUserId: jobdatas.user._id,
                message: $scope.msgsend,
                createBy : "expert"
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