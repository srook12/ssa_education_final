appMod

	.controller("ClassCtrl", ['$http', '$routeParams', '$location', function($http, $routeParams, $location) {
		var self = this;
		//console.log($routeParams);
		self.id = $routeParams.classId;

		$http.get('http://localhost:8080/classes/class')
			.then(function(resp){
				self.classes = resp.data;
			},function(err) {

			});

		if(self.id != undefined) {
			$http.get('http://localhost:8080/classes/class/'+self.id)
				.then(function(resp){
					self.class = resp.data;

					$http.get('http://localhost:8080/departments/department')
						.then(function(resp) {
							self.departments = resp.data;
							self.departments.selected = self.class.department_id.id;

						}, function(err) {
							
						});

				},function(err) {

				});

			$http.get('http://localhost:8080/prereqs/prereq/' + self.id)
				.then(function(resp) {
					self.prereqs = resp.data;
					console.log(self.prereqs);
				});

		}

		self.clear = function(_class) {
			_class.num = "";
			_class.name = "";
			_class.credits = "";
			_class.description = "";
		};

		self.addupdClass = function(func, id, dept_id, num, name, credits, description) {
			var _class = {};
			_class.id = id;
			_class.department_id = self.departments[dept_id - 1];
			_class.num = num;
			_class.name = name;
			_class.credits = credits;
			_class.description = description;

			var method = func == 'add' ? 'POST' : 'PUT';
			$http({
					method: method,
					url: 'http://localhost:8080/classes/class', 
					data: _class
				})
				.then(function(resp){
					console.log('SUCCESS:', resp);
					$location.path('/class');
				},function(err) {
					console.log('FAILURE:', err);
				});
		};

		self.addClass = function(id, department_id, num, name, credits, description) {
			self.addupdClass('add', id, department_id.selected, num, name, credits, description);
		};

		self.updateClass = function(id, department_id, num, name, credits, description) {
			self.addupdClass('upd', id, department_id.selected, num, name, credits, description);
		};

		self.deleteClass = function(id) {
			$http.delete('http://localhost:8080/classes/class/'+id)
				.then(function(resp){
					console.log("SUCCESS: ", resp);
					$location.path('/class');
				},function(err) {
					console.log('FAILURE:', err);
				});

		};

	}]) // end controller
	

;// end all 