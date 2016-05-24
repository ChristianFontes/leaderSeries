(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('profileController', controller);

    function controller($stateParams, $scope, $window, $state, $sessionStorage, 
        User, $ionicModal, AuthService, $ionicLoading) {
        
        $scope.user = {};

        $scope.listAvatares = [
            {url: "./img/avatar.png",  name:"avatar"},
            {url: "./img/avatar2.png", name:"avatar2"},
            {url: "./img/avatar3.png", name:"avatar3"},
            {url: "./img/avatar4.png", name:"avatar4"},
            {url: "./img/avatar5.png", name:"avatar5"}
        ];

        $scope.$on('$ionicView.beforeEnter', function(){
            $ionicLoading.show();
            var user = User.get({id: $sessionStorage.sessionUser.user.id}, function(){
                $scope.user = user;
                $scope.data = {
                    avatar: user.avatar
                };
                $ionicLoading.hide();
            });
        });
        
        $scope.updateAccount = updateAccount;
        $scope.openPictureModal = openPictureModal;
        $scope.closePictureModal = closePictureModal;
        $scope.setAvatar = setAvatar;
        $scope.clearAvatar = clearAvatar;

        $ionicModal.fromTemplateUrl('modules/tabs/account/profile/set.avatar.modal.html', {
            scope: $scope,
            animation: 'fade-in-scale'
        }).then(function (modal) {
            $scope.pictureModal = modal;
        });

        $scope.$on('$destroy', function () {
            $scope.pictureModal.remove();
        });

        function openPictureModal() {
            $scope.pictureModal.show();
            $scope.pictureModal.step = 'select-avatar';
        }

        $scope.toggleImage = function(avatar) {
            var image = avatar.url;
            $scope.data.avatar = image;
        };

        function closePictureModal() {
            $scope.pictureModal.hide();
        }
        
        function clearAvatar(){
            $scope.data.avatar = '';
        }

        // ngCamera management (for mobile version)
        function setAvatar(source) {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                allowEdit: false,
                targetWidth: 400,
                targetHeight: 400,
                correctOrientation: true,
                encodingType: Camera.EncodingType.JPEG,
                saveToPhotoAlbum: false,
                sourceType: source == 'camera' ?
                    Camera.PictureSourceType.CAMERA :
                    Camera.PictureSourceType.PHOTOLIBRARY
            };

            navigator.camera.getPicture(function (image) {
                $scope.data.avatar = "data:image/jpeg;base64," + image;
                $scope.closePictureModal();
            }, function (error) {
                // TODO: handle error
            }, options);
        }
        
        // Input type file management (for web version)
        var handleFileSelect = function (evt) {
            var file = evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function ($scope) {
                    $scope.data.avatar = evt.target.result;
                });
            };
            reader.readAsDataURL(file);
        };
        
        var fileInput = angular.element(document.querySelector('#fileInput'));
        fileInput.on('change',handleFileSelect);

        function updateAccount(form) {
            if (!form.$invalid) {
                var user = new User($scope.data);    
                user.$update({id: $sessionStorage.sessionUser.user.id},function (response) {
                    var user = User.get({id: $sessionStorage.sessionUser.user.id}, function () {
                        $sessionStorage.avatar = user.avatar;
                        $scope.avatar = $sessionStorage.avatar;
                        $sessionStorage.name = user.username;
                        $scope.name = $sessionStorage.name;
                    });
                    $state.go('series.profile');
                    $scope.data = {};
                }, function (error) {
                    $scope.err = error;
                    $ionicLoading.hide();
                });
            } else {
                angular.forEach(form.$error, function (field) {
                    angular.forEach(field, function (errorField) {
                        errorField.$setTouched();
                    });
                });
            }
            $state.reload(true);
        }
        
        $scope.logout = function logout() {
            AuthService.logout();
        }
    }
})();