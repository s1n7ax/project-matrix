app.controller('automate_ctrl', automate_ctrl);
app.service('$restService',restService);

function automate_ctrl ($scope, $compile, $mdSidenav, $http, $mdDialog, $q, $timeout, $restService, $projectService, $testsuiteService, $testcaseService, $componentService, $libraryService, $testsuiteTreeService) {

    "use strict";


    /**
     * Following should be changed
     */
    let serverHostname = window.location.hostname;


    /**
     * Constructor
     */
    let constructor = function () {
        $scope.editor.disableEditor();
        window.scope = $scope;
    };

    $scope.sideNav = new Object();
    $scope.sideNav.selectedViewType = 'tree-view';

    /**
     * Local Properties
     */


    $scope.applicationName = 'BC Creator';


    /**
     * project
     */
    $scope.project = new Object();
    $scope.project._list = new Array();
    $scope.project._selected = null;

    Object.defineProperties($scope.project, {
        list: {
            set: $projectService.set,
            get: $projectService.get
        },

        nameList: {
            get: $projectService.nameList
        },

        selected: {
            get: $projectService.getSelected,
            set: $projectService.setSelected
        },

        selectMenuString: {
            get: $projectService.selectMenuString
        }
    });

    $scope.project.add = $projectService.add;
    $scope.project.remove = $projectService.remove;
    $scope.project.dbRetrieve = $projectService.dbRetrieve;
    $scope.project.onSelect = function () {
        /*$scope.editor.content.name = null;
        $scope.editor.content.type = null;
        $scope.editor.content.user = null;
        $scope.editor.content.isChanged = false;*/

        //$scope.editor.$scope.editor.codeMirror.setValue('');

        $scope.socket.deactivateProjectSocket();
        $scope.socket.deleteProjectSocket();

        $scope.users.dbRetrieve();
        $scope.testsuite.dbRetrieve($scope.project.selected, function () {
            $scope.testcase.dbRetrieve($scope.project.selected, function () {
                $scope.component.dbRetrieve($scope.project.selected, function () {
                    $scope.library.dbRetrieve($scope.project.selected, function () {
                        $scope.testsuiteTree.mapTree();
                        $scope.libraryTree.mapTree();
                    });
                });
            });
        });

        $scope.socket.setProjectSocket($scope.project.selected);
        $scope.socket.activateProjectSocket();

    };
    $scope.project.onClick = function () {
        $scope.project.dbRetrieve();
    };


    /**
     * Users
     */
    $scope.users = new Object();
    $scope.users.list = new Array();
    $scope.users._list = new Array();
    $scope.users.dbRetrieve = function () {
        $restService.getAllUsers({
            projectName: $scope.project.selected
        })
            .then(
            function (res) {
                if(res.data.status) {
                    console.log('Getting all Users - Successful!');
                    console.log(res.data.val);
                    $scope.users._doc = res.data.val;
                    $scope.users.list = res.data.val.userNames;
                    console.log($scope.users.list);
                }
                else {
                    console.log('Getting all Users - Failed!');
                    console.error(res.data.error);
                    $scope.dialog.openErrorPromptDialog({
                        error: res.data.error.error,
                        message: res.data.error.message
                    });
                }
            },
            function (error) {
                console.log('Getting all Users - Failed!');
                console.error(error);
                $scope.dialog.openErrorPromptDialog({
                    error: error.error,
                    message: error.message
                });
            })
    }



    /**
     * Library
     */
    $scope.library = new Object();
    $scope.library._list = new Array();
    $scope.library._selected = null;

    Object.defineProperties($scope.library, {
        list: {
            set: $libraryService.set,
            get: $libraryService.get
        },

        nameList: {
            get: $libraryService.nameList
        },

        selected: {
            get: $libraryService.getSelected,
            set: $libraryService.setSelected
        },

        selectMenuString: {
            get: $libraryService.selectMenuString
        }
    });

    $scope.library.add = $libraryService.add;
    $scope.library.remove = $libraryService.remove;
    $scope.library.getObj = $libraryService.getObj;
    $scope.library.getLinkList = $libraryService.getLinkList;
    $scope.library.dbRetrieve = $libraryService.dbRetrieve;



    /**
     * Test Suite
     */
    $scope.testsuite = new Object;
    $scope.testsuite._list = new Array();
    $scope.testsuite._selected = null;

    Object.defineProperties($scope.testsuite, {
        list: {
            get: $testsuiteService.get,
            set: $testsuiteService.set
        },

        selected: {
            get: $testsuiteService.getSelected,
            set: $testsuiteService.setSelected
        },

        nameList: {
            get: $testsuiteService.nameList
        },

        selectMenuString: {
            get: $testsuiteService.selectMenuString
        }
    });

    $scope.testsuite.add = $testsuiteService.add;
    $scope.testsuite.remove = $testsuiteService.remove;
    $scope.testsuite.getObj = $testsuiteService.getObj;
    $scope.testsuite.getLinkList = $testsuiteService.getLinkList;
    $scope.testsuite.dbRetrieve = $testsuiteService.dbRetrieve;



    /**
     * Testcase
     */
    $scope.testcase;
    $scope.testcase = new Object;
    $scope.testcase._list = new Array();

    Object.defineProperties($scope.testcase, {
        list: {
            set: $testcaseService.set,
            get: $testcaseService.get
        },

        nameList: {
            get: $testcaseService.nameList
        }
    });

    $scope.testcase.add = $testcaseService.add;
    $scope.testcase.remove = $testcaseService.remove;
    $scope.testcase.getObj = $testcaseService.getObj;
    $scope.testcase.getLinkList = $testcaseService.getLinkList;
    $scope.testcase.dbRetrieve = $testcaseService.dbRetrieve;



    /**
     * Component
     */
    $scope.component;
    $scope.component = new Object;
    $scope.component._list = new Array();

    Object.defineProperties($scope.component, {
        list: {
            set: $componentService.set,
            get: $componentService.get
        },

        nameList: {
            get: $componentService.nameList
        }
    });

    $scope.component.add = $componentService.add;
    $scope.component.remove = $componentService.remove;
    $scope.component.getObj = $componentService.getObj;
    $scope.component.getLinkList = $componentService.getLinkList;
    $scope.component.dbRetrieve = $componentService.dbRetrieve;



    /**
     * File Tree
     */
    $scope.fileTree = new Object();

    $scope.fileTree.selected = null;

    $scope.fileTree.setFocus = function (name) {
        if(name !== undefined)
            $scope.fileTree.selected = name;
        else
            $scope.fileTree.selected = null;
    };

    $scope.fileTree.cssMainFileTreeButtonClass = function (name) {
        if(name === $scope.fileTree.selected)
            return 'sub-button-selected'
        else
            return 'sub-button-released'
    };

    /**
     * Test Suite Tree
     */
    $scope.testsuiteTree = new Object();

    $scope.testsuiteTree._list = new Array();

    Object.defineProperties($scope.testsuiteTree, {
        list: {
            get: $testsuiteTreeService.get,
            set: $testsuiteTreeService.set
        }
    });

    $scope.testsuiteTree.mapTree = function () {
        let result = $scope.testsuite.list.map(function (element) {
            return {
                testsuite: element._id,
                testcase: element.links,
                isExpanded: false
            }
        });

        $scope.testsuiteTree.list = result;
    };

    $scope.testsuiteTree.updateNode = function (id) {
        let map = new Object;

        map.testsuite = id;
        map.testcase = $scope.testsuite.getLinkList(id);
        map.isExpanded = false;

        let index = this._list.findIndex(element => element.testsuite === id);

        if(~index) {
            map.isExpanded = this._list[index].isExpanded;
            this._list.splice(index, 1, map);
        }
        else {
            this._list.push(map);
        }
    }
    $scope.testsuiteTree.removeNode = function (id) {
        this._list = this._list.filter(ele => ele.testsuite !== id);
    }

    $scope.testsuiteTree.tsOnClick = function () {

    };

    $scope.testsuiteTree.tcOnClick = function (testcase) {
        let obj = $scope.testcase.getObj(testcase);

        if(obj){
            $scope.editor.addTab(testcase, 'testcase')
            $scope.editor.setEditorContent(obj.content ? obj.content : '');
            $scope.editor.enableEditor();
            $scope.editor.focusTab(testcase);
        }else {
            alert('6+54626545612654980+946');
        }
    };


    /**
     * Library Tree
     */
    $scope.libraryTree = new Object();
    $scope.libraryTree._list = new Array();

    Object.defineProperties($scope.libraryTree, {
        list: {
            get: $libraryService.get,
            set: $libraryService.set
        }
    });

    $scope.libraryTree.mapTree = function () {
        let result =
            $scope.library.list.map(function (element) {
                return {
                    library: element._id,
                    components: element.links,
                    isExpanded: false
                }
            });

        $scope.libraryTree.list = result;
    };

    /**
     * @Get: Lib object
     * @Set:  Lib tree
     * @Return: undefined
     */
    $scope.libraryTree.addLib = function (obj) {
        let index = $scope.libraryTree.list.findIndex(element => element.library === obj._id);

        if(~index) {

            let newObj = new Object();

            newObj.library = obj._id,
            newObj.components = obj.links,
            newObj.isExpanded = this._list[index].isExpanded

            this._list.splice(index, 1, newObj);
        }
        else {
            let newObj = {
                library: obj._id,
                components: obj.links,
                isExpanded: false
            }

            this._list.push(newObj);
        }
    };

    $scope.libraryTree.removeLib = function (id) {
        if($scope.library.list.length < $scope.libraryTree.list.length) {
             let index = $scope.libraryTree.list.findIndex(element => element.library === id);
             $scope.libraryTree.list.splice(index, 1);
        }
    };

    $scope.libraryTree.libOnClick = function () {
        $scope.editor.setEditorContent({
            name: null,
            type: null,
            user: null,
            isChanged: false,
            text: null
        });

//         $scope.editor.setEditorContent('');
//         $scope.component.selected = null;
//         $scope.editor.content = {
//             header: null,
//             type: null
//         };
    };

    $scope.libraryTree.cOnClick = function (comp) {
        let obj = $scope.component.getObj(comp);

        if(obj){
            $scope.editor.addTab(comp, 'component')
            $scope.editor.setEditorContent(obj.content ? obj.content : '');
            $scope.editor.enableEditor();
            $scope.editor.focusTab(comp);
        }else {
            alert('652198125616565465');
        }
    }















































    /**
     * CodeMirror
     */

//    CodeMirror.commands.autocomplete = function(cm) {
//        cm.showHint({hint: CodeMirror.hint.anyword});
//    };

    $scope.editor = new Object();
    $scope.editor.tabs = new Array();
    $scope.editor.selected = new Object();
    $scope.editor.cur = 0;

    let textArea = document.getElementById("code");

    // Code Mirror Configuration
    $scope.editor.codeMirror = CodeMirror.fromTextArea(textArea, {
        lineNumbers: true,
        extraKeys: {"Ctrl-Space": "autocomplete"},

    });

    $scope.editor.addTab = function (title, type) {
        if(!$scope.editor.tabs.find(ele => ele.title === title)){
            $scope.editor.tabs.push({
                title: title,
                type: type
            });
            return true;
        }
        else
            return false;
    };

    $scope.editor.removeTab = function (event) {
        $scope.editor.currentTab = undefined;

        let tabName = event.currentTarget.getAttribute('value');
        $scope.editor.tabs = $scope.editor.tabs.filter(ele => ele.title !== tabName);
        $scope.editor.disableEditor();
    };

    $scope.editor.focusTab = function (title) {
        $scope.editor.currentTab = title;
    };

    $scope.editor.clickOnTab = function (ev, tab) {
        $scope.editor.saveContent();

        if(tab.type === 'testcase'){
            let obj = $scope.testcase.getObj(tab.title);

            if(obj){
                $scope.editor.setEditorContent(obj.content ? obj.content : '');
            }
            else {
                alert('error 656546521+94654654984');
                $scope.editor.dissableEditor();
            }
        }
        else if(tab.type === 'component'){
            let obj = $scope.component.getObj(tab.title);

            if(obj){
                $scope.editor.setEditorContent(obj.content ? obj.content : '');
            }
            else {
                alert('error 656546521+94654654984');
                $scope.editor.dissableEditor();
            }
        }

        $scope.editor.enableEditor();
    }

    $scope.editor.setEditorContent = function (val) {
        $scope.editor.codeMirror.setValue(val);
    };

    $scope.editor.getEditorContent = function () {
        return $scope.editor.codeMirror.getValue();
    }

    $scope.editor.disableEditor = function () {
        $scope.editor.setEditorContent('');
        $scope.editor.codeMirror.doc.cantEdit = true;
    };

    $scope.editor.enableEditor = function () {
        $scope.editor.codeMirror.doc.cantEdit = false;
    };

    $scope.editor.filterCommandList = function (cmdList, curWord) {
        let result = [];
        if(!curWord)
            return cmdList;
        else{
            let startWithWrd = new RegExp('^' + curWord, 'i');
            let containsWrd = new RegExp(curWord, 'i');

            result = cmdList.filter(function (item, index) {
                if(startWithWrd.test(item)){
                    cmdList = cmdList.slice(index, 1);
                    return true;
                }
                else {
                    return false;
                }
            }).sort();

            let val = cmdList.filter(function (item) {
                return containsWrd.test(item);
            });
            result = result.concat(val)

            return result;
        }
    }

    //Code Mirror Configurations
    CodeMirror.commands.autocomplete = function(cm) {
        cm.showHint({hint: CodeMirror.hint.sanitizorAautocomplete});
    }

    CodeMirror.hint.sanitizorAautocomplete = function (editor) {
        let list = APPLICATION_COMMAND_LIST;

        let cursor = editor.getCursor();
        let currentLine = editor.getLine(cursor.line);
        let start = cursor.ch;
        let end = start;
        let elementHint = false;

        if(STARTS_WITH_CALL_REGEX.test(currentLine)){
            let val = currentLine.replace(STARTS_WITH_CALL_REGEX, "").replace(CONTAINS_WHITE_SPACE_REGEX, "");

            if(val !== ''){
                let statement = val.split('.');

                if(statement.length === 1){
                    list = $scope.library.nameList;
                }
                else if(statement.length > 1){
                    let libObj = $scope.library.getObj(statement[0]);

                    if(libObj){
                        list = libObj.links ? libObj.links : []
                    }
                }
            }
            else{
                list = $scope.library.nameList;
            }

            //list = $scope.component.nameList;
        }
        //
        // else if(STARTS_WITH_COMMAND_REGEX.test(currentLine)){
        //     list = [];
        // }


        while (end < currentLine.length && /[\w$]+/.test(currentLine.charAt(end))) ++end;
        while (start && /[\w$]+/.test(currentLine.charAt(start - 1))) --start;

        var curWord = start != end && currentLine.slice(start, end);

        var result = {
            list: $scope.editor.filterCommandList(list, curWord),
            from: CodeMirror.Pos(cursor.line, start),
            to: CodeMirror.Pos(cursor.line, end)
        };

        return result;
    };


    /*CodeMirror.defineSimpleMode("simplemode", {
      // The start state contains the rules that are intially used
      start: [
        // The regex matches the token, the token property contains the type
        {regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string"},
        // You can match multiple tokens at once. Note that the captured
        // groups must span the whole string in this case
        {regex: /(function)(\s+)([a-z$][\w$]*)/,
         token: ["keyword", null, "variable-2"]},
        // Rules are matched in the order in which they appear, so there is
        // no ambiguity between this one and the one above
        {regex: /(?:function|var|return|if|for|while|else|do|this)\b/,
         token: "keyword"},
        {regex: /true|false|null|undefined/, token: "atom"},
        {regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
         token: "number"},
        {regex: /\/\/.*//*, token: "comment"},
        {regex: /\/(?:[^\\]|\\.)*?\//, token: "variable-3"},
        // A next property will cause the mode to move to a different state
        {regex: /\/\*//*, token: "comment", next: "comment"},
        {regex: /[-+\*//*=<>!]+/, token: "operator"},
        // indent and dedent properties guide autoindentation
        {regex: /[\{\[\(]/, indent: true},
        {regex: /[\}\]\)]/, dedent: true},
        {regex: /[a-z$][\w$]*//*, token: "variable"},
        // You can embed other modes with the mode property. This rule
        // causes all code between << and >> to be highlighted with the XML
        // mode.
        {regex: /<</, token: "meta", mode: {spec: "xml", end: />>/}}
      ],
      // The multi-line comment state.
      comment: [
        {regex: /.*?\*\//, token: "comment", next: "start"},
        {regex: /.*//*, token: "comment"}
      ],
      // The meta property contains global information about the mode. It
      // can contain properties like lineComment, which are supported by
      // all modes, and also directives like dontIndentStates, which are
      // specific to simple modes.
      meta: {
        dontIndentStates: ["comment"],
        lineComment: "//"
      }
    });*/

    $scope.editor.codeMirror.addKeyMap({
        'Ctrl-S': function (cm) {
            $scope.editor.cur = $scope.editor.codeMirror.doc.getCursor();
            $scope.editor.saveContent(cm)
        },
        'Enter': function (cm) {
            $scope.editor.cur = $scope.editor.codeMirror.doc.getCursor();
            /*let cur = cm.doc.getCursor();
            let line = cm.doc.getLine(cur.line);
            let pos = {
                line: cur.line,
                ch: line.length
            }*/

            cm.doc.replaceRange('\n', $scope.editor.cur);
            $scope.editor.cur.line += 1;
            $scope.editor.cur.ch = 0;

            $scope.editor.saveContent(cm);
            //return CodeMirror.Pass
        },
        'Ctrl-Click': function (cm) {
            console.log(cm);
        }
    }, true);

    $scope.editor.codeMirror.on('mousedown', function (cm, e) {
        if(e.ctrlKey && e.srcElement.innerHTML !== ''){
            e.preventDefault();
            let cpm = $scope.component.getObj(e.srcElement.innerHTML);
            let tc =  $scope.testcase.getObj(e.srcElement.innerHTML);
            if(cpm){
                $scope.libraryTree.cOnClick(cpm._id);
            }
            else if(tc){
                $scope.testsuiteTree.tcOnClick(tc._id);
            }
        }
    })

    $scope.editor.saveContent = function(cm, callback) {
		if(!cm) cm = $scope.editor.codeMirror;
	
        if ($scope.editor.currentTab) {
            let obj = $scope.editor.tabs.find(ele => ele.title === $scope.editor.currentTab);

            if(obj && obj.type){
                if(obj.type === 'component') {
                    let component = $scope.component.getObj($scope.editor.currentTab);
                    let currentContent = $scope.editor.getEditorContent();

                    if(!component.content) component.content = '';
                    let cmpNoSpaceContent = component.content.replace(CONTAINS_WHITE_SPACE_GLOBAL_REGEX, '');
                    let currentCmpNoSpaceContent = currentContent.replace(CONTAINS_WHITE_SPACE_GLOBAL_REGEX, '');


                    if(cmpNoSpaceContent !== currentCmpNoSpaceContent){

                        let componentCopy = angular.copy(component);

                        componentCopy.content = currentContent;

                        $restService.setComponent({
                            projectName: $scope.project.selected,
                            val: componentCopy
                        })
                            .then(
                            function successCallback(res) {
                                if(res.data.status) {
                                    console.log('\n');
                                    console.log('Saving Component - Successful!');
                                    console.log(res.data.val);
                                    //$scope.editor.content.isChanged = false;

                                    if (callback)
                                        callback();
                                }
                                else {
                                    console.log('\n');
                                    console.error('Saving Component - Failed!');
                                    console.log(res.data.error);
                                    //$scope.editor.content.isChanged = true;
                                }
                            }, function errorCallback(error) {
                                console.log('\n');
                                console.log('Saving Component - Failed!')
                                console.error(error);
                                //$scope.editor.content.isChanged = true;
                            });
                    }
                }
                else if(obj.type === 'testcase') {
                    let testcase = $scope.testcase.getObj($scope.editor.currentTab);
                    let testcaseCopy = angular.copy(testcase);

                    testcaseCopy.content = cm.doc.getValue();

                    $restService.setTestcase({
                        projectName: $scope.project.selected,
                        val: testcaseCopy
                    })
                        .then(
                        function successCallback (res) {
                            if(res.data.status) {
                                console.log('\n');
                                console.log('Saving Testcase - Successful!');
                                console.log(res.data.val);
                                //$scope.editor.content.isChanged = false;

                                if(callback)
                                    callback();
                            }
                            else {
                                console.log('\n');
                                console.error('Saving Testcase - Failed!');
                                console.log(res.data.error);
                                //$scope.editor.content.isChanged = true;
                            }
                        },
                        function errorCallback (error) {
                            console.log('\n');
                            console.log('Saving Testcase - Failed!')
                            console.error(error);
                            //$scope.editor.content.isChanged = true;
                        });
                }
            }
        }
    };

    $scope.editor.updateEditor = function (data) {
        $scope.editor.setEditorContent(data);
        $scope.editor.codeMirror.doc.setCursor($scope.editor.cur);
    }



    /**
     * Option Menu
     */
    $scope.optionMenu = new Object();
    $scope.optionMenu.openOptionMenu = function ($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
    };


    /**
     * Browse Button
     */
    $scope.upload = {};
    $scope.upload.fileChoosed = function() {
        if($scope.project.selected) {
            let fileInput = document.getElementById('fileBrowser');
            let file = fileInput.files[0];


            let form = new FormData();
            form.append("file", file);
            form.append('projectName', $scope.project.selected);

            $.ajax({
                url: "/getSanitizationStepsByTemplate",
                type: "POST",
                data: form,
                processData: false,
                contentType: false,
                success: function(response) {
                    let win = window.open(location.origin + '/temp/' + response);
                },
                error: function(jqXHR, textStatus, errorMessage) {
                    alert('failed')
                    console.log(errorMessage);
                }
            });
        }else {
            alert('select a project you idiot');
        }

    }

    /**
     * Dialog Menu
     */
    $scope.dialog = new Object();

    $scope.dialog.openCreatePromptDialog = function (ev, action, itemType, onClickItemName) {
        let self = this;
        let config = {
            controller: CreatePromptDialogCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'templates/create-dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                lscope: $scope,
                action: action,
                itemType: itemType,
                onClickItemName: onClickItemName
            }
        };

        $mdDialog.show(config)
            .then(function (data) {
                if(data.status)
                    console.log(data)
                else{
                    console.error(data.error);
                    $scope.dialog.openErrorPromptDialog(data.error);
                }
            });

        function CreatePromptDialogCtrl($timeout, $q, $log, $mdDialog, $scope, $restService, lscope, action, itemType, onClickItemName) {
            "use strict";

            /* Properties */
            let self = this;
            let autocompleteProperties = new Object();

            self.simulateQuery = false;
            self.isDisabled    = false;


            self.states        = getAutocompleteMap();
            self.querySearch   = querySearch;
            self.selectedItemChange = selectedItemChange;
            self.searchTextChange   = searchTextChange;
            self.newState = newState;


            $scope.itemType = itemType;
            $scope.action = action;
            $scope.users = new Object();
            $scope.users.list = lscope.users.list;

            self.chipIsHidden = true;

            self.ownerSelectMenuString = function () {
                if(self.owner === undefined)
                    return 'Select A Owner';
                else
                    return 'Owner: '+self.owner;
            }

            if(itemType === 'project'){
                self.chipIsHidden = false;
                self.readonly = false;

                self.userNames = [];
            }

            if(itemType === 'testcase' || itemType === 'component') {
                self.ownerTXTIsHidden = false;
            }
            else
                self.ownerTXTIsHidden = true;

            /* Methods */
            self.ok = function () {
                let resPromise;
                let selectedProjectName = lscope.project.selected;

                if(
                    self.searchText !== '' &&
                    self.searchText !== null &&
                    ( (self.searchText.match(/\s+/) && itemType === 'testcase') || !self.searchText.match(/\s+/) )

                    ){

                    if(itemType === 'project') {
                        let users = {
                            _id: 'users',
                            type: 'users',
                            userNames: self.userNames
                        };

                        resPromise = $restService.createProject({
                            projectName: self.searchText,
                            users: users
                        });
                    }

                    else if(itemType === 'testsuite'){
                        resPromise = $restService.createTestsuite({
                            projectName: selectedProjectName,
                            val: {
                                _id: self.searchText,
                                type: itemType
                            }
                        });
                    }

                    else if(itemType === 'testcase') {
                        if(self.owner !== '' && self.owner !== undefined) {
                            let parentNode = lscope.testsuite.getObj(onClickItemName);

                            //parentNode._deleted = false;

                            resPromise = $restService.createTestcase({
                                projectName: selectedProjectName,
                                parentNode: parentNode,
                                val: {
                                    _id: self.searchText,
                                    type: itemType,
                                    status: 'Pending',
                                    owner: self.owner
                                }
                            });
                        }
                        else {
                            alert('Owner Name Is Mandatory');
                        }
                    }

                    else if(itemType === 'component'){
                        if(self.owner !== '' && self.owner !== undefined) {
                            let parentNode = lscope.library.getObj(onClickItemName);

                            //parentNode._deleted = false;

                            resPromise = $restService.createComponent({
                                projectName: selectedProjectName,
                                parentNode: parentNode,
                                val: {
                                    _id: self.searchText,
                                    type: itemType,
                                    status: 'Pending',
                                    owner: self.owner
                                }
                            });
                        }
                        else {
                            alert('Owner Name Is Mandatory');
                        }
                    }

                    else if(itemType === 'library')
                        resPromise = $restService.createItem({
                            projectName: selectedProjectName,
                            val: {
                                _id: self.searchText,
                                type: itemType
                            }
                        });

                    else
                        console.error('Unable to create item. Invalid Item type!')

                    resPromise
                        .then(function successCallback (res) {
                            $mdDialog.hide(res.data);
                        },
                        function (error) {
                            $mdDialog.hide({
                                status: false,
                                val: null,
                                error: error
                            });
                        });
                }
                else if(self.searchText === '' || self.searchText === null){
					$mdDialog.hide({
                        status: false,
                        error: {
                            error: 'Name of the '+itemType+'is empty',
                            message: 'Name is mandatory for creating a '+itemType
                        }
                    });
				}
				else if(self.searchText.match(/\s+/)){
					$mdDialog.hide({
                        status: false,
                        error: {
                            error: 'Name of the '+itemType+' has empty spaces',
                            message: 'Please remove white spaces and add '+itemType+ 'again'
                        }
                    });
				}

            };

            self.cancel = function($event) {
                $mdDialog.cancel();
            };

            function getAutocompleteMap () {
                let objMap;
                if(itemType === 'project')
                    objMap = lscope.project.nameList.map((element)=> {
                        return {
                            value: element.toLowerCase(),
                            display: element
                        }
                    })
                else if(itemType === 'testsuite') {
                    objMap = lscope.testsuite.nameList.map(function (element) {
                        return {
                            value: element.toLowerCase(),
                            display: element
                        }
                    });
                }
                else if(itemType === 'testcase') {
                    objMap = lscope.testsuite.getLinkList(onClickItemName).map(function (element) {
                        return {
                            value: element.toLowerCase(),
                            display: element
                        }
                    });
                }
                else if(itemType === 'library') {
                    objMap = lscope.library.nameList.map(function (element) {
                        return {
                            value: element.toLowerCase(),
                            display: element
                        }
                    });
                }
                else if(itemType === 'component') {
                    objMap = lscope.component.nameList.map(function (element) {
                        return {
                            value: element.toLowerCase(),
                            display: element
                        }
                    });
                }

                return objMap;
            };

            function querySearch (query) {

                var results = query ? self.states.filter( createFilterFor(query) ) : self.states,
                deferred;
                if (self.simulateQuery) {
                    deferred = $q.defer();
                    $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
                    return deferred.promise;
                } else {
                    return results;
                }
            };

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);

                return function filterFn(state) {
                    return (state.value.indexOf(lowercaseQuery) >= 0);
                };

            }

            function selectedItemChange (item) {
                $log.info('Item changed to ' + JSON.stringify(item));
            };

            function searchTextChange (text) {
                $log.info('Text changed to ' + text);
            };

             function newState (state) {
                alert("Sorry! You'll need to create a Constitution for " + state + " first!");
            }
        };
    };

    $scope.dialog.openResourceEditorDialog = function (ev, action, itemType) {
        let self = this;
        let config = {
            controller: AddResourcePromptDialogCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'templates/resource-edit-dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                lscope: $scope,
                action: action,
                itemType: itemType
            }
        };

        $mdDialog.show(config)
            .then(function (data) {
                if(data.status)
                    console.log(data)
                else{
                    console.error(data.error);
                    $scope.dialog.openErrorPromptDialog(data.error);
                }
            });

        function AddResourcePromptDialogCtrl($timeout, $q, $log, $mdDialog, $scope, $restService, lscope, action, itemType) {
            var self = this;

            self.readonly = false;
            self.removable = true;
            self.resources = angular.copy(lscope.users.list);

            self.ok = function () {
                let userDoc = angular.copy(lscope.users._doc);
                userDoc.userNames = self.resources;

                $restService.setResources({
                    projectName: lscope.project.selected,
                    userDoc: userDoc
                })
                    .then(
                        function successCallback(data) {
                            $mdDialog.hide(data);
                        },
                        function errorCallback(error) {
                            $mdDialog.hide({
                                status: false,
                                error: error,
                                body: null
                            })
                        });
            }

            self.cancel = function () {
                $mdDialog.cancel();
            };


        }
    };

    $scope.dialog.openDeleteConfirmDialog = function (ev, itemType, name) {
        let self = this;

        let config = {
            controller: DeleteConfirmDialogCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'templates/delete-dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                lscope: $scope,
                itemType: itemType,
                name: name
            }
        };

        $mdDialog.show(config)
            .then(function (data) {
                if(data.status)
                    console.log(data)
                else{
                    console.error(data.error)
                    $scope.dialog.openErrorPromptDialog(data.error)
                }
            });

        function DeleteConfirmDialogCtrl($mdDialog, $scope, $restService, lscope, itemType, name) {
            "use strict";
            let self = this;

            $scope.itemType = itemType;
            $scope.name = name;

            self.ok = function () {
                let project = lscope.project.selected;
                let val;
                let resPromise;

                if(itemType === 'testcase') {
                    let val;
                    let index;
                    let parentNode;
                    let parentNodeCopy;

                    val = lscope.testcase.list.find(element => element._id === name);

                    parentNode = lscope.testsuite.list.find(function (element) {
                        index = element.links.indexOf(name);
                        return index > -1;
                    });

                    if(parentNode) {
                        parentNodeCopy = angular.copy(parentNode);
                        parentNodeCopy.links.splice(index, 1);
                    }

                    resPromise = $restService.deleteTestcase({
                        projectName: project,
                        parentNode: parentNodeCopy,
                        val: val
                    });
                }
                else if(itemType === 'component') {
                    val = lscope.component.getObj(name);
                    let index;

                    let parentNode = lscope.library.list.find(function(element){
                        if(element.links) {
                            index = element.links.indexOf(name);
                            return index > -1;
                        }
                        else {
                            alert('Error : 003, Please contact server admin');
                        }
                    })


                    if(~index) {
                        var parentNodeCopy = angular.copy(parentNode);
                        parentNodeCopy.links.splice(index, 1);
                    }


                    resPromise = $restService.deleteComponent({
                        projectName: project,
                        parentNode: parentNodeCopy,
                        val: val
                    });
                }
                else if(itemType === 'library') {
                    val = lscope.library.getObj(name);
                    resPromise = $restService.deleteItemAndChildren({
                        projectName: project,
                        val: val
                    });
                }
                else if(itemType === 'testsuite') {
                    val = lscope.testsuite.getObj(name);
                    resPromise = $restService.deleteItemAndChildren({
                        projectName: project,
                        val: val
                    });
                }

                resPromise
                    .then(
                    function successCallback(res) {
                        $mdDialog.hide(res.data);
                    },
                    function errorCallback(error) {
                        $mdDialog.hide({
                            status: false,
                            val: null,
                            error: error
                        });
                    });
            };

            self.cancel = function($event) {
                $mdDialog.cancel();
            };
        };
    };

    $scope.dialog.openAddPromptDialog = function (ev, itemType, name) {
        "use strict";
        let config = {
            controller: AddPromptDialogCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'templates/add-dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                 lscope: $scope,
                 itemType: itemType,
                 name: name
            }
        }

        $mdDialog.show(config)
            .then(function (data) {
                if(data.status)
                    console.log(data)
                else{
                    console.error(data.error);
                    $scope.dialog.openErrorPromptDialog(data.error);
                }
            });

        function AddPromptDialogCtrl ($scope, lscope, itemType, name) {
            let self = this;

            $scope.library = lscope.library;
            $scope.itemType = itemType;
            $scope.name = name;

            $scope.getComponentsOfLib = function () {
                if($scope.selectedLibrary !== undefined)
                    return $scope.library.getLinkList($scope.selectedLibrary);
                else
                    return new Array();
            };

            $scope.librarySelectText = function () {
                if($scope.selectedLibrary !== undefined)
                    return 'Library : '+$scope.selectedLibrary;
                else
                    return 'Select a library';
            };

            $scope.componentSelectText = function () {
                if($scope.selectedComponents !== undefined)
                    if($scope.selectedComponents.length > 1)
                        return 'Components : '+$scope.selectedComponents;
                    else
                        return 'Component : '+$scope.selectedComponents;
                else
                    return 'Select a component';
            };

            $scope.componentSelectorIsDisabled = function () {
                if($scope.selectedLibrary !== undefined)
                    return false;
                else
                    return true;
            };


            self.ok = function ($event) {
                if($scope.selectedLibrary !== undefined &&
                    $scope.selectedComponents !== undefined) {

                    let obj = lscope.testcase.getObj($scope.name);

                    if(obj.links)
                        obj.links = obj.links.concat($scope.selectedComponents);
                    else
                        obj.links = $scope.selectedComponents;


                    $restService.setTestcase({
                        projectName: lscope.project.selected,
                        val: obj
                    })
                        .then(function successCallback(res) {
                            $mdDialog.hide(res.data);
                        },
                        function errorCallback(error) {
                            $mdDialog.hide({
                                status: false,
                                val: null,
                                error: error
                            });
                        })
                }
            }
            self.cancel = function($event) {
                $mdDialog.cancel();
            };



        }
    };

    $scope.dialog.openChangeOwnerConfirmDialog = function (ev, itemType, name) {
        "use strict";
        let config = {
            controller: SetOwnerPromptDialogCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'templates/owner-dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                 lscope: $scope,
                 itemType: itemType,
                 name: name
            }
        }

        $mdDialog.show(config)
            .then(function (data) {
                if(data.status)
                    console.log(data)
                else{
                    console.error(data.error);
                    $scope.dialog.openErrorPromptDialog(data.error);
                }
            });


        function SetOwnerPromptDialogCtrl ($scope, lscope, itemType, name) {
            let self = this;
            let resPromise;
            let project = lscope.project.selected;

            self.itemType = itemType;
            self.name = name;

            self.ownerSelectText = function () {
                if(self.owner)
                    return 'Owner : '+self.owner;
                else {
                    let obj = lscope.component.getObj(name);
                    if(!obj)
                        obj = lscope.testcase.getObj(name);
                    return 'Current Owner : '+ obj.owner;
                }
            };

            self.list = lscope.users.list;

            self.ok = function ($event) {
                    if(self.owner !== '' && self.owner !== undefined) {
                        if(itemType === 'component') {
                            let obj = angular.copy(lscope.component.getObj(name));
                            obj.owner = self.owner;

                        if(obj !== undefined) {
                            resPromise = $restService.setComponent({
                                projectName: project,
                                val: obj
                            });
                        }
                    }
                    else if (itemType === 'testcase') {
                        let obj = angular.copy(lscope.testcase.getObj(name));
                        obj.owner = self.owner;

                        if(obj !== undefined) {
                            resPromise = $restService.setTestcase({
                                projectName: project,
                                val: obj
                            });
                        }
                    }

                    resPromise.then(function (res) {
                        $mdDialog.hide(res.data);
                    },
                    function(error) {
                        $mdDialog.hide({
                            status: false,
                            error: error,
                            val: null
                        });
                    });
                }
                else {
                    $mdDialog.hide({
                        status: false,
                        error: {
                            error: 'Name of the owner is empty',
                            message: 'Enter the name of the owner to assign the '+itemType
                        }
                    })
                }
            };

            self.cancel = function($event) {
                $mdDialog.cancel();
            };
        };
    };

    $scope.dialog.openChangeStatusConfirmDialog = function (ev, itemType, name) {
            "use strict";
            let config = {
                controller: ChangeStatusPromptDialogCtrl,
                controllerAs: 'ctrl',
                templateUrl: 'templates/status-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                     lscope: $scope,
                     itemType: itemType,
                     name: name
                }
            };

            $mdDialog.show(config)
                .then(function (data) {
                    if(data.status)
                        console.log(data)
                    else{
                        console.error(data.error);
                        $scope.dialog.openErrorPromptDialog(data.error);
                    }
                });

            function ChangeStatusPromptDialogCtrl ($scope, lscope, itemType, name) {
                let self = this;

                $scope.itemType = itemType;
                $scope.name = name;

                let resPromise;
                let project = lscope.project.selected;
                let itemObj =
                    itemType === 'testcase' ? angular.copy(lscope.testcase.getObj(name)) :
                    itemType === 'component' && angular.copy(lscope.component.getObj(name))

                let enabledCommandRegexp = new RegExp('Completed|Automatable|In Progress', 'i', 'y');



                $scope.list = ['Pending', 'Completed', 'Automatable', 'Pending Clarification', 'In Progress',
                    'Out of Scope', 'Not Automatable', 'Application Issue', 'Blocked'];

                $scope.statusMap = getStatusMap();

                console.log(getStatusMap());

                function getStatusMap() {
                    return $scope.list.map((ele) => {
                        let obj = {};
                        obj.view = ele;

                        if((!itemObj.content || itemObj.content === '') && enabledCommandRegexp.test(ele)) {
                            obj.enabled = false;
                        }
                        else
                            obj.enabled = true;

                        return obj;
                    });
                }

                $scope.statusSelectText = function () {
                    let obj;

                    if($scope.selectedStatus !== undefined)
                        return 'Status : '+ $scope.selectedStatus;
                    else {
                        switch(itemType) {
                            case 'component': obj = lscope.component.getObj(name); break;

                            case 'testcase': obj = lscope.testcase.getObj(name);; break;
                        }
                        return 'Status : '+ obj.status;
                    }
                };

                self.ok = function ($event) {
                    if($scope.selectedStatus !== undefined) {
                        itemObj.status = $scope.selectedStatus;

                        resPromise = $restService.setTestcase({
                            projectName: project,
                            val: itemObj
                        });
                    }
                    else {
                         $mdDialog.hide({
                             status: false,
                             error: {
                                 error: 'Status is not selected!',
                                 message: 'Select a status of the '+itemType
                             }
                         })
                     }

                    resPromise.then(function (res) {
                        $mdDialog.hide(res.data);
                    },
                    function (error) {
                        $mdDialog.hide({
                            status: false,
                            val: null,
                            error: error
                        })
                    });
                }

                self.cancel = function($event) {
                    $mdDialog.cancel();
                };
            }
    };

    $scope.dialog.openErrorPromptDialog = function (error, enableClose) {
		if(enableClose === undefined)
			enableClose = true;

        let config = {
            controller: ErrorPromptDialogCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'dialog1.tmpl',
            parent: angular.element(document.body),
            clickOutsideToClose: enableClose,
            locals: {
                 lscope: $scope,
                 error: error,
				 enableClose: enableClose
            }
        };

        $mdDialog.show(config);


        function ErrorPromptDialogCtrl ($scope, lscope, error, enableClose) {
            let self = this;

            $scope.error = error.error;
            $scope.message = error.message;

            self.ok = function ($event) {
				if(enableClose)
					$mdDialog.hide();
            }
            self.cancel = function($event) {
				if(enableClose)
					$mdDialog.cancel();
            };
        }
    };

    $scope.dialog.openRenamePromptDialog = function (ev, itemType, currentName, parentName) {
        let config = {
            controller: RenamePromptDialogCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'templates/rename-dialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                 lscope: $scope,
                 itemType: itemType,
                 currentName: currentName,
                 parentName: parentName
            }
        };

        $mdDialog.show(config)
			.then(function (data) {
                if(data.status)
                    console.log(data);
                else{
                    console.error(data.error);
                    $scope.dialog.openErrorPromptDialog(data.error);
                }
            })

        function RenamePromptDialogCtrl ($scope, lscope, itemType, currentName, parentName) {
            let self = this;
            let parentNode;
            let project = lscope.project.selected;
            $scope.name = currentName;

            if(parentName)
                if(itemType === 'component')
                    parentNode = angular.copy(lscope.library.getObj(parentName));
                else if(itemType === 'testcase')
                    parentNode = angular.copy(lscope.testsuite.getObj(parentName));

            let renameComponent = function () {
                parentNode.links = parentNode.links.map((element) => {
                    if(element === currentName)
                        return self.searchText;
                    else
                        return element;
                });

                return $restService.renameComponent({
                    projectName: project,
                    _id: currentName,
                    _newid: self.searchText,
                    parentNode: parentNode,
                });
            }

            let renameTestcase = function () {
                parentNode.links = parentNode.links.map((element) => {
                    if(element === currentName)
                        return self.searchText;
                    else
                        return element;
                });

                return $restService.renameTestcase({
                    projectName: project,
                    _id: currentName,
                    _newid: self.searchText,
                    parentNode: parentNode,
                });
            };

            let renameLibrary = function () {
                return $restService.renameLibrary({
                    projectName: project,
                    _id: currentName,
                    _newid: self.searchText,
                });
            };

            let renameTestsuite = function () {
                return $restService.renameTestsuite({
                    projectName: project,
                    _id: currentName,
                    _newid: self.searchText,
                });
            };


            self.ok = function ($event) {
                if(self.searchText !== '' && self.searchText !== undefined && !(self.searchText.match(/\s+/))) {
                    let promise;

                    switch(itemType) {
                        case 'component': promise = renameComponent(); break;
                        case 'testcase': promise = renameTestcase(); break;
                        case 'library': promise = renameLibrary(); break;
                        case 'testsuite': promise = renameTestsuite(); break;
                    }

                    promise.then(
                    function successCallback(res) {
                        $mdDialog.hide(res.data);
                    },
                    function errorCallback(error) {
                        $mdDialog.hide({
                            status: false,
                            val: null,
                            error: error
                        });
                    });
                }
                else if(self.searchText === '' || self.searchText === undefined){
					$mdDialog.hide({
                        status: false,
                        error: {
                            error: 'Name of the '+itemType+' is empty',
                            message: 'Name is required'
                        }
                    });
                }
				else if(self.searchText.match(/\s+/)){
					$mdDialog.hide({
                        status: false,
                        error: {
                            error: 'Name of the '+itemType+' has empty spaces',
                            message: 'Please remove white spaces and add '+itemType+ 'again'
                        }
                    });
				}
            }

            self.cancel = function($event) {
                $mdDialog.cancel();
            };
        }
    };

    $scope.dialog.openWarningPromptDialog = function (warning) {
            let config = {
                controller: WarningPromptDialogCtrl,
                controllerAs: 'ctrl',
                templateUrl: 'templates/warning-dialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                locals: {
                     lscope: $scope,
                     warning: warning
                }
            };

            $mdDialog.show(config);

            function WarningPromptDialogCtrl ($scope, lscope, warning) {
                let self = this;
                $scope.warning = warning.warning;
                $scope.message = warning.message;

                self.ok = function ($event) {
                    $mdDialog.cancel();
                }

                self.cancel = function($event) {
                    $mdDialog.cancel();
                };
            }
    };




    /**
     * Socket IO
     */
    $scope.socket = new Object();

    /* Properties */
    $scope.socket.projectsocket;

    /* Project socket functions */
    $scope.socket.setProjectSocket = function (projectName) {
        let conString = `http://${serverHostname}:444/${projectName}`;

        $scope.socket.projectsocket = io(conString, {
            reconnection: true
        });
    };

    $scope.socket.deactivateProjectSocket = function () {
        $scope.socket.projectsocket &&
            $scope.socket.projectsocket.disconnect();
    };

    $scope.socket.deleteProjectSocket = function () {
        $scope.socket.projectsocket &&
            delete $scope.socket.projectsocket;
    };

    $scope.socket.activateProjectSocket = function () {
        $scope.socket.projectsocket.on('connect', function () {
            console.log('\n');
            console.log('Client Socket : Connecting project socket - Successful!');
        });

        $scope.socket.projectsocket.on('error', function (error) {
            console.log('\n');
            console.error('Root socket connection error');
            console.log(error);

            $scope.dialog.openErrorPromptDialog({
                error: 'Connection has lost with the server',
                message: 'Please Reload the page!'
            }, false);
        });

        $scope.socket.projectsocket.on('disconnect', function () {
            console.log('\n');
            console.error('Root socket is disconnected');

            $scope.dialog.openErrorPromptDialog({
                error: 'Connection has lost with the server',
                message: 'Please Reload the page!'
            }, false);
        });

        $scope.socket.projectsocket.on('ServerMessage', function (data) {
            console.log(data);
        });

        $scope.socket.projectsocket.on('updates', onProjectUpdate);

        //$scope.socket.projectsocket.on('editor live update', onEditorLiveUpdate)
    };

    let onProjectUpdate = function (data) {
        console.log('\n');
        console.log('Client Socket : New Project Update!');
        console.log(data);

        switch(data.val.type) {
            case 'testsuite': onTestSuiteChange(data); break;
            case 'testcase': onTCChange(data); break;
            case 'component': onComponentChange(data); break;
            case 'library': onLibraryChange(data); break;
            case 'users': onUsersUpdate(data); break;
            default : {
                if(data.change === 'delete') {
                    $scope.testsuite.remove(data.val._id);
                    $scope.testcase.remove(data.val._id);
                    $scope.component.remove(data.val._id);
                    $scope.library.remove(data.val._id);

                    $scope.libraryTree.removeLib(data.val._id);
                    $scope.testsuiteTree.removeNode(data.val._id);
                }
            }
        }
    };

    let onTestSuiteChange = function (data) {
        if(data.change === 'add') {
            $scope.testsuite.add(data.val);
            $scope.testsuiteTree.updateNode(data.val._id);
        }
    };

    /*
    should be changed
    */
    let onTCChange = function (data) {
        if(data.change === 'add') {
            $scope.testcase.add(data.val);
            if($scope.editor.currentTab === data.val._id){
                // let currentEditorContent = $scope.editor.getEditorContent().replace(CONTAINS_WHITE_SPACE_GLOBAL_REGEX, '');
                // let receivedContent = data.val.content.replace(CONTAINS_WHITE_SPACE_GLOBAL_REGEX, '');
                //
                // if(currentEditorContent !== receivedContent)
                $scope.editor.updateEditor(data.val.content ? data.val.content : '');
            }
        }
    };

    /*
    should be changed
    */
    let onComponentChange = function (data) {
        if(data.change === 'add') {
            $scope.component.add(data.val);
            if($scope.editor.currentTab === data.val._id){
                // let currentEditorContent = $scope.editor.getEditorContent().replace(CONTAINS_WHITE_SPACE_GLOBAL_REGEX, '');
                // let receivedContent = data.val.content.replace(CONTAINS_WHITE_SPACE_GLOBAL_REGEX, '');
                //
                // if(currentEditorContent !== receivedContent)
                $scope.editor.updateEditor(data.val.content ? data.val.content : '');
            }
        }
    };

    let onLibraryChange = function (data) {
        if(data.change === 'add') {
            $scope.library.add(data.val);
            $scope.libraryTree.addLib(data.val);
        }
    };


    let onUsersUpdate = function (data)  {
        if(data.change === 'add') {
            $scope.users._doc = data.val;
            $scope.users.list = data.val.userNames;
        }
    }
    /**
     * :param {name, type, user, isChanged}
     */
    // let onEditorLiveUpdate = function (item) {
    //     if($scope.editor.content.name !== null &&
    //         $scope.editor.content.type !== null) {
    //         if($scope.editor.content.name === content.name &&
    //             $scope.editor.content.type === content.type) {
    //             $scope.editor.setEditorContent(item);
    //         }
    //     }
    // }



    /**
     * Context Menu Template
     */
    $scope.contextMenu = new Object();
    $scope.contextMenu.onTestSuite =
        `
        <div id='contextmenu-node'>
            <div class='contextmenu-item'
                ng-click="dialog.openCreatePromptDialog($event, 'create', 'testcase', node.testsuite)">Create Testcase</div>
            <div class='contextmenu-item'
                ng-click="dialog.openRenamePromptDialog($event, 'testsuite', node.testsuite)">Rename</div>
            <div class='contextmenu-item'
                ng-click="dialog.openDeleteConfirmDialog($event, 'testsuite', node.testsuite)">Delete Test Auite</div>
        </div>
        `
    $scope.contextMenu.onLibrary =
        `
        <div id='contextmenu-node'>
            <div class='contextmenu-item'
                ng-click="dialog.openCreatePromptDialog($event, 'create', 'component', node.library)">Create Component</div>
            <div class='contextmenu-item'
                ng-click="dialog.openRenamePromptDialog($event, 'library', node.library)">Rename</div>
            <div class='contextmenu-item'
                ng-click="dialog.openDeleteConfirmDialog($event, 'library', node.library)">Delete Library</div>
        </div>
        `

    $scope.contextMenu.onComponent =
        `
        <div id='contextmenu-node'>
            <div class='contextmenu-item'
                ng-click="dialog.openRenamePromptDialog($event, 'component', component, node.library)">Rename Component</div>
            <div class='contextmenu-item'
                ng-click="dialog.openDeleteConfirmDialog($event, 'component', component)">Delete Component</div>
            <div class='contextmenu-item'
                ng-click="dialog.openChangeOwnerConfirmDialog($event, 'component', component)">Change Owner</div>
            <div class='contextmenu-item'
                ng-click="dialog.openChangeStatusConfirmDialog($event, 'component', component)">Change Status</div>
        </div>
        `

    $scope.contextMenu.onTestcase =
            `
            <div id='contextmenu-node'>
                <div class='contextmenu-item'
                    ng-click="dialog.openRenamePromptDialog($event, 'testcase', testcase, node.testsuite)">Rename Testcase</div>
                <div class='contextmenu-item'
                    ng-click="dialog.openDeleteConfirmDialog($event, 'testcase', testcase)">Delete Testcase</div>
                <div class='contextmenu-item'
                    ng-click="dialog.openChangeOwnerConfirmDialog($event, 'testcase', testcase)">Change Owner</div>
                <div class='contextmenu-item'
                    ng-click="dialog.openChangeStatusConfirmDialog($event, 'testcase', testcase)">Change Status</div>
            </div>
            `
    constructor();
};


app.directive( "contextMenu", function($compile, $interpolate){

    contextMenu = {};
    contextMenu.restrict = "AE";

    contextMenu.link = function( lScope, lElem, lAttr){

        lElem.on("contextmenu", function (e) {
            e.preventDefault();
            let template = lScope.contextMenu[lAttr.contextmenuTemplate];

            if($("#contextmenu-node"))
                $("#contextmenu-node").remove();

            lElem.append( $compile(template)(lScope) );

            $("#contextmenu-node").css("position", 'absolute');
            $("#contextmenu-node").css("z-index", '1000');

            $("#contextmenu-node").css("left", e.clientX);
            $("#contextmenu-node").css("top", lElem[0].offsetTop);
        });


        lElem.on("mouseleave", function(e){
            if($("#contextmenu-node"))
                $("#contextmenu-node").remove();
        });
    };
    return contextMenu;
});

app.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeFunc = scope.$eval(attrs.customOnChange);
      element.bind('change', function(event){
        var files = event.target.files;
        onChangeFunc(files);
      });

      element.bind('click', function(){
        element.val('');
      });
    }
  };
});