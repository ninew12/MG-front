
angular
.module('myApp')
.controller('CustomerController', ['$scope', '$location', '$anchorScroll',
function ($scope, $location, $anchorScroll) {
	$scope.scrollTo = function(id) {
		$location.hash(id);
		$anchorScroll();
	 }
	$scope.testimonials = [
		{img:'https://via.placeholder.com/150x100'},
		{img:'https://via.placeholder.com/150x100'},
		{img:'https://via.placeholder.com/150x100'},
		{img:'https://via.placeholder.com/150x100'},
		{img:'https://via.placeholder.com/150x100'},
		{img:'https://via.placeholder.com/150x100'},
		{img:'https://via.placeholder.com/150x100'},
		{img:'https://via.placeholder.com/150x100'},
		{img:'https://via.placeholder.com/150x100'},
		{img:'https://via.placeholder.com/150x100'},
		{img:'https://via.placeholder.com/150x100'},
		{img:'https://via.placeholder.com/150x100'},
		{img:'https://via.placeholder.com/150x100'},
		{img:'https://via.placeholder.com/150x100'},
		{img:'https://via.placeholder.com/150x100'},
		{img:'https://via.placeholder.com/150x100'},
		{img:'https://via.placeholder.com/150x100'},
		{img:'https://via.placeholder.com/150x100'}
	];
}]);

