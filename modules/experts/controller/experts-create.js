
angular
.module('myApp')
.directive('mediaPreview', function ($log, $document) {
    var directive = {
        restrict: 'E',
        scope: { someCtrlFn:'&callFuc'},
        // model: '=?'},
        template: '<input type="file" accept="image/*,video/*,audio/*" ng-model="model" />',
        // '<input type="button" ng-click="clearPreview()" value="X" />'
        link: _link
    }
    return directive;
    function _link(scope, elem, attrs) {
         
         
        var $input = angular.element(elem.children().eq(0));
        // get the model controller
        var ngModel = $input.controller('ngModel');
        // the preview container
        var container;
        var fallbackImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAA00lEQVR4Ae2XwQqDQAxEveinFD9e2MUfq6Cep7GnrPAg1JVCu5OTvEwe9FLtWlpqR6OyVn2aXbNGdX6KB4OLrmbRyIKsGsksWKsINhbUShM0wVcEk43CnAVY722mMEfBhPWD9mGOAlvBepSDwK1gPc5LASp8fbCJ81KACl9PNkOYo8CfKOtHUpijwJ841y1xToJy5VxXnLPgvUL1OAeBW4F6kKPAnYB6jKPAnYA68PZ/8EOCJtjvfvmdqwjSvR8gTz1YcCiytgs/TvLnvaDi/J2gCV63ZgZdEb12DwAAAABJRU5ErkJggg==";

        // get custom class or set default
        var previewClass = attrs.previewClass || 'media-preview';

        // get custom class or set default
        var containerClass = attrs.containerClass || 'media-container';

        if (typeof attrs.multiple !== 'undefined' && attrs.multiple != 'false') {
            $input.attr('multiple', true);
        }

        // as default if nothing is specified or
        // the element specified is not a valid html
        // element: create the default media container
        // and append before input element
        if (!attrs.previewContainer || (!document.getElementById(attrs.previewContainer) && !angular.isElement(attrs.previewContainer))) {

            // create container
            container = angular.element(document.createElement('div'));

            // append before elem
            elem.parent()[0].insertBefore(container[0], elem[0]);

        } else {

            // get the container
            container = angular.isElement(attrs.previewContainer) ? attrs.previewContainer : angular.element(document.getElementById(attrs.previewContainer));
        }

        // add default class
        container.addClass(containerClass);
         
        // the change function
        function onChange(e) {

            // get files from target
            var files = $input[0].files;
            // scope.inputMedia(files, previewClass, container);
            // update model value
            attrs.multiple ? ngModel.$setViewValue(files) : ngModel.$setViewValue(files[0]);
            // reset container
            // container.empty();

            // check if there are files to read
            if (files && files.length) {

                // start the load process for each file
                angular.forEach(files, function (data, index) {

                    // init variables
                    var $reader = new FileReader(), result, $mediaElement, $removeMedia;
                    // set fallback image on error
                    $reader.onloaderror = function (e) {
                        result = fallbackImage;
                    }

                    // set resulting image
                    $reader.onload = function (e) {
                        result = e.target.result;
                        scope.testmdedia(result);
                    }
                     
                    scope.testmdedia = function (result){
                        scope.someCtrlFn(result);
                    }
                    // when file reader has finished
                    // add the source to element and append it
                    $reader.onloadend = function (e) {

                        // if audio
                        if (result.indexOf('data:audio') > -1) {

                            $mediaElement = angular.element(document.createElement('audio'));
                            $mediaElement.attr('controls', 'true');

                        } else if (result.indexOf('data:video') > -1) {

                            $mediaElement = angular.element(document.createElement('video'));
                            $mediaElement.attr('controls', 'true');

                        } else {

                            $mediaElement = angular.element(document.createElement('img'));
                             
                        }
                        // $removeMedia = '<input type="button" id="clear" value="X" /></div>';
                        // $divwarp = angular.element(document.createElement('div'));
                        // add the source
                        $mediaElement.attr('src', result);
                        // add the element class
                        $mediaElement.addClass(previewClass);
                        // append to the preview container
                        container.append($mediaElement);
                         
                        // Boss customize
                        // container.append('<div class="col-sm-5ths col-md-5ths col-lg-5ths"><img height="300px;"src="' + result + '"/>'+
                        // $removeMedia);
                    }

                    // read file
                    // fileService.push($reader);
                    $reader.readAsDataURL(data);
                     
                });

            }

        }
        // clear the preview and the input on click
        // scope.clearPreview = function (files) {
        //     console.log('clearPreview');
        //     // clear the input value
        //     $input.val('');
        //     // reset container
        //     container.empty();
        // }

        // bind change event
        elem.on('change', onChange);

        // unbind event listener to prevent memory leaks
        scope.$on('$destroy', function () {
            elem.off('change', onChange);
        });
    }

})
 
.controller('ExpertsCreateController', ['$translate', '$anchorScroll', '$location', '$interval', '$timeout', 'authService', '$scope', '$uibModal', '$http', 'URL_API',
    function ($translate, $anchorScroll, $location, $interval, $timeout, authService, $scope, $uibModal, $http, URL_API) {
        $scope.lang = $translate.use();
        $scope.isLoggedIn = false;
        $scope.filesArray = [];
        $scope.portMediaArray = [];
        $scope.picToApi = [];
        $scope.portToApi = [];
        $scope.uploadFile = function(e){
                var files = e[0];
                $scope.picToApi.push(files);
                // console.log(files);
                var $reader = new FileReader();
                $reader.onload = function (e) {
                    var result = e.target.result;
                    // console.log(result);
                    $scope.filesArray.push(result);
                    $scope.$apply();
                }
            $reader.readAsDataURL(files);

        };
        $scope.uploadPort = function(e){
            var files = e[0];
            $scope.portToApi.push(files);
            // console.log(files);
            var $reader = new FileReader();
            $reader.onload = function (e) {
                var result = e.target.result;
                // console.log(result);
                $scope.portMediaArray.push(result);
                $scope.$apply();
            }
            $reader.readAsDataURL(files);
        };

        $scope.removePreImg = function(item) {
            $scope.filesArray.splice(item, 1);   
        }
        $scope.removePortImg = function(item) {
            $scope.portMediaArray.splice(item, 1);   
        }
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
        $http.get(URL_API + '/api/v1/job_types')
            .then(function (res) {
                $scope.loaded = true;
                $scope.jobTypes = res.data.data;
             
            });
        $scope.imglang = 'assets/img/flag_' + $scope.lang + '.png';
        $scope.chgLang = function (lang) {
            $scope.imglang = 'assets/img/flag_' + lang + '.png';
            $scope.lang = lang;
            $translate.use(lang);
        };
        $scope.selectjob = function () {
            console.log('selectjob');
            $http.get(URL_API + '/api/v1/tags?jobType=' + $scope.datajob._id)
                .then(function (res) {
                    $scope.tags = res.data.data;
                    console.log(res.data.data);
                });
        };
        $scope.submitexpertsCreate = function (idachor) {
            document.getElementById("creexpt").disabled = true;
            // var fd = new FormData();                
            console.log($scope.datajob._id);
            console.log($scope.user);
            console.log($scope.datatag);
            console.log($scope.portToApi);
            console.log($scope.picToApi);
            // fd.append('pic', $scope.picToApi);
            if($scope.picToApi.length === 0){
                document.getElementById("creexpt").disabled = false;
                $scope.picErr = true;
                $location.hash('errpic');
                $anchorScroll();
            }else {
                // var fd = new FormData();
                // fd.append('file', $scope.picToApi[0]);
                // $http.post(URL_API + '/api/v1/upload', fd, {
                //     transformRequest: angular.identity,
                //     headers: {
                //         'Content-Type': undefined,
                //         'x-access-token': userdata.accessToken,
                //         "Authorization": 'Basic c2Vuc2Vpbm86U2Vuc2Vpbm9AMjAxNw=='
                //     }
                // }).then(function (res) {
                //         console.log(res);
                //     }, function (err) {
                //         $scope.err = true;
                //         $scope.errmsg = err.data.description;
                //         console.log(err.data);
 
                //     });
                $http.post(URL_API + '/api/v1/experts', {
                    name: $scope.user.exptname,
                    jobType: $scope.datajob._id,
                    tag: $scope.datatag._id,
                    price: $scope.user.price,
                    priceType: $scope.user.jobunit,
                    detail: $scope.user.des,
                    experience: $scope.user.exp,
                    education: $scope.user.ed,
                    pic: $scope.picToApi,
                    portfolio: $scope.portToApi
                }).then(function (res) {
                    window.location.href = '/#/experts'
                    console.log(res);
                }, function (err) {
                    $scope.err = true;
                    $scope.errmsg = err.data.description;
                    console.log(err.data);

                });
            }
        }
    }]);