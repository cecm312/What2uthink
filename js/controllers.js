angular.module('starter.controllers', [])

        .controller('AppCtrl', function ($scope, $timeout, $state, $firebaseAuth, $firebaseArray) {
            var ref = new Firebase("https://blinding-inferno-8232.firebaseio.com");
            $scope.authObj = $firebaseAuth(ref);
            var authData = $scope.authObj.$getAuth();
            if (authData == null) {
                $state.go("start.login");
            } else {
                var ref = new Firebase("https://blinding-inferno-8232.firebaseio.com/product");
                $scope.products = $firebaseArray(ref);
            }
            $scope.logout = function () {
                $scope.authObj.$unauth();
                $state.go("start.login");
            }
        })
        .controller('LoginCtrl', function ($scope, $timeout, $state, $firebaseAuth, $ionicPopup, $firebaseObject, $ionicLoading) {
            $scope.loginData = {};
            var ref = new Firebase("https://blinding-inferno-8232.firebaseio.com");
            $scope.authObj = $firebaseAuth(ref);
            var authData = $scope.authObj.$getAuth();

            if (authData != null) {
                $state.go("app.products");
            }

            $scope.showregister = function () {
                $state.go("start.register");
            }
            $scope.recoverPass = function () {
                $state.go("start.forgot");
            }

            $scope.doLogin = function () {
                $ionicLoading.show({
                    template: 'Accediendo...'
                });
                if ($scope.loginData.username != "" && $scope.loginData.password) {

                    $scope.authObj.$authWithPassword({
                        email: $scope.loginData.username,
                        password: $scope.loginData.password
                    }).then(function (authData) {
                        var url = "https://blinding-inferno-8232.firebaseio.com/users/" + authData.uid;
                        var ref = new Firebase(url);
                        var user = $firebaseObject(ref);
                        user.$loaded().then(function () {
                            $ionicLoading.hide();
                            var alertPopup = $ionicPopup.alert({
                                title: 'Bienvenido ' + user.name,
                                template: ''
                            });
                            alertPopup.then(function () {
                                $state.go("app.products");
                            });
                        });

                    }).catch(function (error) {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: error
                        });
                    });
                } else {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'No se puede iniciar sesion',
                        template: "Ingrese su correo y contraseña"
                    });
                }
            };
        })
        .controller('AddProductCtrl', ['$scope', '$state', 'Upload', '$ionicPopup', '$ionicLoading', function ($scope, $state, Upload, $ionicPopup, $ionicLoading) {
                $scope.article = {};
                $scope.AddProduct = function (file) {

                    $ionicLoading.show({
                        template: 'Guardando...'
                    });

                    Upload.base64DataUrl(file).then(function (base64Urls) {
                        $scope.article.image = base64Urls;
                        $scope.article.uploadDate = Firebase.ServerValue.TIMESTAMP;
                        $scope.article.user = $scope.authObj.$getAuth().uid;
                        $scope.products.$add($scope.article).then(function (result) {
                            $ionicLoading.hide();
                            var alertPopup = $ionicPopup.alert({
                                title: 'Articulo Guardado',
                                template: "Tu articulo ha sido guardado"
                            }).then(function () {
                                $scope.article.title = "";
                                $scope.article.description = "";
                                $scope.article.cost = "";
                                $scope.files = null;
                                $state.go("app.products");
                            });
                        });
                    });

                }



            }])


        .controller('ProductsCtrl', function ($scope, $firebaseObject) {
            $scope.products.$loaded();
        })

        .controller('ProductCtrl', function ($scope, $stateParams, $firebaseObject) {
            $scope.products.$loaded(function () {
                $scope.product = $scope.products.$getRecord($stateParams.product_id);
                var ref = new Firebase("https://blinding-inferno-8232.firebaseio.com/users/" + $scope.product.user);

                $scope.profile = $firebaseObject(ref);
                $scope.valorar = function (valoracion) {

                    if ($scope.product.valoration == undefined) {
                        $scope.product.valoration = {};
                    }
                    if ($scope.product.valoration[$scope.authObj.$getAuth().uid] == undefined) {
                        $scope.product.valoration[$scope.authObj.$getAuth().uid] = 0;
                    }

                    $scope.products.$save($scope.product);
                    $scope.product.valoration[$scope.authObj.$getAuth().uid] = valoracion;
                    $scope.products.$save($scope.product);
                };
            });


        })

        .controller('RegisterCtrl', function ($scope, $firebaseObject, $ionicPopup, $state, $firebaseAuth, $ionicLoading) {
            $scope.newUser = {};
            var ref = new Firebase("https://blinding-inferno-8232.firebaseio.com/groups");
            $scope.groups = $firebaseObject(ref);
            ref = new Firebase("https://blinding-inferno-8232.firebaseio.com/teams");
            $scope.teams = $firebaseObject(ref);
            var ref = new Firebase("https://blinding-inferno-8232.firebaseio.com");
            $scope.authObj = $firebaseAuth(ref);
            $scope.newUser = {};
            $scope.validatepass = function () {
                if ($scope.newUser.password != $scope.newUser.repassword) {
                    $scope.newUser.repassword = "";
                }
            };
            $scope.newUser.group = "ITIC102";
            $scope.newUser.team = "Equipo 5";
            $scope.addUser = function () {
                $ionicLoading.show({
                    template: 'Registrando...'
                });
                $scope.authObj.$createUser({
                    email: $scope.newUser.email,
                    password: $scope.newUser.password
                }).then(function (userData) {$ionicLoading
                    return $scope.authObj.$authWithPassword({
                        email: $scope.newUser.email,
                        password: $scope.newUser.password
                    });
                }).then(function (authData) {
                    
                    if (authData) {
                        delete $scope.newUser.email;
                        delete $scope.newUser.password;
                        delete $scope.newUser.repassword;
                        var ref = new Firebase("https://blinding-inferno-8232.firebaseio.com");
                        ref.onAuth(function (authData) {
                            if (authData) {
                                ref.child("users").child(authData.uid).set($scope.newUser);
                            }
                        });
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Registro completo',
                            template: ""
                        });
                        alertPopup.then(function () {
                            $state.go("app.products");
                        });
                    }
                }).catch(function (error) {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'No se completo el registro',
                        template: error
                    });
                });
            };
        });
