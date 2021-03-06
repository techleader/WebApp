var app = angular.module('socialNetwork', [ 'ngRoute','route-segment', 'view-segment' ]);

app.config(function ($routeSegmentProvider) {
	$routeSegmentProvider.when('/Login','login')	
	.segment('login', {
        templateUrl: 'login.html',
        controller: 'LoginController'});
	
	$routeSegmentProvider
	.when('/Main','main')
	.when('/Main/Home','main.home')
	.when('/Main/Home/Timeline','main.home.timeline')
	.when('/Main/Home/Connections','main.home.connections')
	.when('/Main/Profile','main.profile')
	.when('/Main/Profile/About','main.profile.about')
	.when('/Main/Profile/Timeline','main.profile.timeline')
	.when('/Main/Profile/Timeline/UploadImage','main.profile.timeline.uploadimage')
	.when('/Main/Connections','main.connections')
	.when('/Main/Messages','main.messages')
	
	.segment('main', {
        templateUrl: 'main_page.html',
        controller: 'TabController'}).        
        within().
        segment('home', {
            templateUrl: 'home.html',
            controller: 'TabController'}).
            within().
	        	segment('timeline', {
	        		templateUrl: 'Timeline.html',
	        		untilResolved: { templateUrl: 'loading.html'}}).
	        	segment('connections', {
	                templateUrl: 'friends.html',
	                controller: 'FriendsController2'}).
	        up().	
	        segment('messages', {
                templateUrl: 'messages.html'}).
	        segment('connections', {
                templateUrl: 'friends.html',
                controller: 'FriendsController2'}).
        segment('profile', {
            templateUrl: 'profile.html',
            controller: 'TabController'}).
            within().
            segment('about', {
            	templateUrl: 'about.html',
            	controller: 'personCtrl'}).
            segment('timeline', {
            	templateUrl: 'Timeline.html',
            	untilResolved: { templateUrl: 'loading.html'}}).
            within().
            segment('uploadimage', {
            	templateUrl: 'image.html',
            	controller: 'personCtrl'});

});

/*app.factory("session",  ["$window", function($window)
		  {
		    var session =
		      angular.fromJson($window.sessionStorage.getItem("app")) || {};

		    $window.addEventListener(
		      "beforeunload",
		      function()
		      {
		        $window.sessionStorage.setItem("app", angular.toJson(session));
		      })
		    return session;
 }]);*/


app.config([ '$httpProvider', function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
} ]);

app.controller('MainCtrl', function($scope, $routeSegment, loader) {

    $scope.$routeSegment = $routeSegment;
    $scope.loader = loader;

    $scope.$on('routeSegmentChange', function() {
        loader.show = false;
    })
});

app.controller('LoginController',[ '$scope','$http','$location','$window', function($scope, $http,$location,$window) {
	    $scope.doLogin = true;
	    $scope.userdetailsToValidate = {};
		$scope.userValidated = false;
		$scope.friendlist = "Friend List";
		$scope.userProfile={};
		
		$scope.toggleLogin = function() {
				$scope.doLogin = !$scope.doLogin;					 
			};
				
			$scope.update = function(userdetails) {
				$scope.userdetailsToValidate = angular.copy(userdetails);
			};

			 $scope.validate = function(userdetails) {
				 $http.get('http://localhost:8080/RestSocialNetwork/isValidUser?email='
						 							+ userdetails.email
						 							+ '&password='
						 							+ userdetails.password)
						 							
						 .success(function(response){						 
							 if (response === '') {
								 $scope.errorMsg ="Login Failed";
							 } else {
								 $window.sessionStorage.setItem('userlogged', JSON.stringify(response));
								 $location.path('/Main/Home');
								 $scope.userProfile=response;
							 } 
							 
						 })						 
						 .error(function(data, status, headers,config) {
											$scope.errorMsg = "Request Failed"
											 + status;
								 });
			 };
			 $scope.registerUser = function(userSignUp) {
				 $http.get( 'http://localhost:8080/RestSocialNetwork/userSignup?username='
						 + userSignUp.username
						 + '&email='
						 + userSignUp.email
						 + '&password='
						 + userSignUp.password)
						 .success( function(response) {
									 $scope.response = "Successfully Registered";
								 })
								 .error(
										 function(data, status, headers,
												 config) {
											 $scope.response = 'Registeration failed';
										 });
			 };

			 $scope.reset = function() {
				 $scope.userdetails = angular
				 .copy($scope.userdetailsToValidate);
			 };
			 $scope.reset();
		 } ]);

app.controller('TabController', ['$scope','$http','$location','$window',function($scope, $http,$location,$window) {
			this.tab = 1;
			$scope.userLogged = angular.fromJson($window.sessionStorage.getItem("userlogged"));
			this.setTab = function(newValue) {
				this.tab = newValue;
			};

			this.isSelected = function(tabName) {
				return this.tab === tabName;
			};
			this.showPanel=function(requestUri){
				$location.path(requestUri);
			};
			
		} ]);

app.controller('FriendsController', ['$scope','$http',function($scope, $http) {
			getfriendlist = function() {
				this.friendlst = "Invoking request";
				$http.get('http://localhost:8080/RestSocialNetwork/friendlist')
						.success(function(response) {
							$scope.friendlist = response;
						});
				return friendlst;
			};
		} ]);

app.controller('FriendsController2', function($scope, $http) {
		$http.get("http://localhost:8080/RestSocialNetwork/friendlist")
			.success(function(response) {
				$scope.friendlistResponse = response;
			});
});

app.controller('ConversationController', function($scope, $http, $window) {
	$scope.conversation=[];
	$scope.userLogged = angular.fromJson($window.sessionStorage.getItem("userlogged"));
	
			$scope.getConversation= function(user){
				
				$http.get("http://localhost:8080/RestSocialNetwork/listConversations?user="+user)
					
					.success(function(response) {
						$scope.listConversations = response;
					});
			};
			
			$scope.getAllConversations= function(){
				$http.get("http://localhost:8080/RestSocialNetwork/listAllConversation")
					.success(function(response) {
						$scope.listOfConversations = response;
						 
					});
			};
			
			$scope.getSingleUserConversations= function(conversation_id){
				$http.get("http://localhost:8080/RestSocialNetwork/getUserConversations?id="+conversation_id)
					.success(function(response) {
						$scope.UserConversations = response;
						 
					});
			};
			
			$scope.addMessages=function(message,user1,user2){
				/* $window.alert(user1);*/
			$http.get("http://localhost:8080/RestSocialNetwork/addMessages?message="+message
										+"&user1="+user1
										+"&user2="+user2)
				
				.success(function(response) {
					$scope.addMessagesResponse = response;
					
		});
	};
});

app.controller('CommentController',['$scope','$http',function($scope, $http) {
	$scope.userComment = function(statusComment, t,userName)
	{
			$http.get("http://localhost:8080/RestSocialNetwork/addCommentToTimeline?comment="
														+ statusComment.comment
														+ "&username="
														+ userName
														+ "&timelineid=" + t.id)
										.success(function(response) {
											t = response;
										})
										.error(function(data, status, headers,config) {
													$scope.timelineResponse = 'Registeration failed';
												});
							};
							$scope.likeComment = function(commentid,timelineid, username) {
								$http.get("http://localhost:8080/RestSocialNetwork/likeComment?commentid="
												+ commentid + "&username="
												+ username + "&timelineid="
												+ timelineid)
										.success(function(response) {
											$scope.timelineResponse = response;
										});
							};
							$scope.likeTimeline = function(timelineid, userame) {
								$scope.timelineResponse = 'started';
								$http.get("http://localhost:8080/RestSocialNetwork/likeTimeline?username="
												+ username + "&timelineid="
												+ timelineid)
								.success(function(response) {
											$scope.timelineResponse = response;
										});
							};
							$scope.addTimeline = function(status,username){
								$http.get("http://localhost:8080/RestSocialNetwork/addTimeLine?status="
														+ status + "&username="
														+ username)
										.success(function(response) {
													$http.get("http://localhost:8080/RestSocialNetwork/listAllTimeLines")
														.success(function(response) {
																$scope.timelines = response;
															});
												});
							};

						} ]);

app.controller('customersCtrl', function($scope, $http) {
	$http.get("http://localhost:8080/RestSocialNetwork/listAllTimeLines")
			.success(function(response) {
				$scope.timelines = response;
			});
});

app.controller('personCtrl', function($scope) {
	$scope.myVar1 = true;
	$scope.myVar2 = true;
	$scope.myVar3 = true;

	$scope.toggle1 = function() {
		$scope.myVar1 = !$scope.myVar1;
	};
	$scope.toggle2 = function() {
		$scope.myVar2 = !$scope.myVar2;
	};
	$scope.toggle3 = function() {
		$scope.myVar3 = !$scope.myVar3;
	};

});