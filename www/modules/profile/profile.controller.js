(function () {
    'use strict';
    angular.module('leaderSeries')
        .controller('profileController', controller);

    function controller($stateParams, $scope, $window, $state, $sessionStorage, 
        User, $ionicModal, AuthService) {
        
        $scope.user = {};

        $scope.listAvatares = [
            {url: "avatar.png",  name:"avatar"},
            {url: "avatar2.png", name:"avatar2"},
            {url: "avatar3.png", name:"avatar3"},
            {url: "avatar4.png", name:"avatar4"},
            {url: "avatar5.png", name:"avatar5"}
        ];

        $scope.$on('$ionicView.beforeEnter', function(){
            var user = User.get({id: $sessionStorage.sessionUser.user.id}, function(){
                $scope.user = user;
                $scope.data = {
                    avatar: user.avatar
                };
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
            var image = "/img/" + avatar.url;
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
                console.log($scope.data);
                var user = new User($scope.data);    
                    user.$update({id: $sessionStorage.sessionUser.user.id},function (response) {
                    $state.go('series.profile');
                    $scope.data = "";
                    $state.reload(true);
                }, function (error) {
                    $scope.err = error;
                });
            } else {
                angular.forEach(form.$error, function (field) {
                    angular.forEach(field, function (errorField) {
                        errorField.$setTouched();
                    });
                });
            }
        }
        
        $scope.logout = function logout() {
            AuthService.logout();
        }
    }
})();