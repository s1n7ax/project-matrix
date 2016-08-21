//$scope.$apply(); use this to update the scope

var gl = 'hello';
var projectName;
var moduleName;


angular.module('automate', ['ngMaterial', 'ngMessages'])
  .controller('automate-ctrl', function ($scope, $mdSidenav, $http, $mdDialog) {

    /********** TOOLBAR **********/
    $scope.applicationName = 'AutoMate';



    /********** OPTION MENU **********/
    $scope.openOptionMenu = function ($mdOpenMenu, ev) {
      $mdOpenMenu(ev);
    }

    /********** OPTION MENU -> CREATE PROJECT **********/
    $scope.inputPrompt = function (itemName, ev) {

      var config = $mdDialog.prompt()
        .title(`Enter ${itemName} Name`)
        .textContent(itemName + ' name should be unique')
        .placeholder(itemName + 'Name')
        .ariaLabel(itemName + ' Name')
        .initialValue('')
        .targetEvent(ev)
        .disableParentScroll(true)
        .clickOutsideToClose(true)
        .ok('Okay')
        .cancel('Cancel');

      $mdDialog.show(config).then(function (result) {
        
        $http({
          method: 'POST',
          url: '/createProject',
          data: {name: result}
        })
        .then(function successCallBack(res) {
          console.log(res);          
        }, function errorCallBack(error) {
          console.error(error);
        });
      });


    }



    /********** TOOLBAR SELECT PROJECT **********/
    $scope.moduleSelectorIsEnabled = true;

    $scope.getProjectNames = function () {
      $http({
        method: 'POST',
        url: '/getProjectNames'
      })
        .then(function successCallBack(res) {
          $scope.projects = res.data;
        }, function errorCallBack(error) {
          console.error(error);
        })
    };

    $scope.getSelectedProject = function () {
      if ($scope.selectedProject !== undefined) {
        console.log(gl);
        $scope.moduleSelectorIsEnabled = false;
        return 'Project : ' + $scope.selectedProject;
      } else
        return 'Select a project';
    };

    /********** TOOLBAR SELECT MODULE **********/
    $scope.getModuleNames = function () {
      if (projectName !== undefined) {
        $http({
          method: 'POST',
          url: '/getModuleNames'
        })
          .then(function successCallBack(res) {
            $scope.modules = res.data;
          }, function errorCallBack(error) {
            console.error(error);
          });
      } else {
        console.error('project name is not defined');
      }
    };

    $scope.getSelectedModule = function () {
      if ($scope.selectedModule !== undefined)
        return 'Module : ' + $scope.selectedModule;
      else
        return 'Select a module';
    };






    /********** SIDE NAVIGATOR **********/
    $scope.toggleNav = buildToggle('side-nav');

    function buildToggle(componentID) {
      return function () {
        $mdSidenav(componentID).toggle();
      }
    }


    /********** SIDE NAVIGATOR BAR **********/
    $scope.selectedViewType = 'module-view';




    /********** EDITOR **********/
    var textArea = document.getElementById('textArea');

    CodeMirror.fromTextArea(textArea, {
      lineNumbers: true
    });

  });
