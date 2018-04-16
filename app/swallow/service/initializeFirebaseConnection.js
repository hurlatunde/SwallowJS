/**
 * Created by olatundeowokoniran on 9/24/16.
 */
/**
 * Firebase Connection
 * SwallowJs(tm) : SwallowJs Framework (http://docs.swallow.js)
 *
 * For full copyright and license information, please see the LICENSE.txt
 *
 * @link          http://docs.swallow.js SwallowJs(tm) Project
 * @package       component.utility.service.initializeFirebaseConnection.js
 * @since         SwallowJs(tm) v 0.2.9
 */

if (typeof firebase !== 'undefined') {

    var firebaseBaseDatabase;
    var FirebaseService;
    var storageRef;

    /**
     * Check if firebase is configure
     */
    if (firebaseConfig.apiKey != 'APP-API-KEY' || firebaseConfig.databaseURL != 'APP-DATABASE-URL') {
        logMessage('**** Firebase database config. ****');
        // var mainApp = firebase.initializeApp(firebaseConfig);

        /**
         * Connecting to Firebase database system
         */
        firebaseBaseDatabase = mainApp.database();
        storageRef = firebase.storage().ref();
    } else {
        firebaseBaseDatabase = null;
        logMessage('**** Firebase database not config yet ****');
    }

    function firebaseObjectToArray(childSnapshot) {
        var childData;
        if (typeof childSnapshot.val == 'function') {
            childData = childSnapshot.val();
        } else {
            childData = childSnapshot;
        }

        var innerdata = Array();

        for (var dataSet in childData) {
            var innerSetData = {};
            var childDataObject = childData[dataSet];

            for (var childSet in childDataObject) {
                var innerChildDataObject = childDataObject[childSet];
                if (typeof innerChildDataObject === "object") {
                    var dataReturn = firebaseObjectToArrayInner(innerChildDataObject);
                    innerSetData[childSet] = dataReturn;
                } else {
                    innerSetData[childSet] = innerChildDataObject;
                }
            }
            innerdata.push(innerSetData);
        }
        return innerdata;
    }

    function firebaseObjectToArrayInner(innerChildDataObject) {
        var innerData = Array();
        for (var dataSet in innerChildDataObject) {
            var childDataObject = innerChildDataObject[dataSet];

            var innerChildDataObjectSet = {};
            for (var dataInnerSet in childDataObject) {
                var innerChildDataSet = childDataObject[dataInnerSet];
                if (typeof innerChildDataSet === "object") {
                    innerChildDataObjectSet[dataInnerSet] = firebaseObjectToArrayInner(innerChildDataSet)
                } else {
                    innerChildDataObjectSet[dataInnerSet] = innerChildDataSet;
                }
            }
            innerData.push(innerChildDataObjectSet);
        }
        return innerData;
    }

    /**
     *
     * @constructor
     */
    FirebaseDataModel = function () {
    };

    $.extend(FirebaseDataModel.prototype, {

        /**
         *
         * @param node
         * @return {*|string}
         */
        initKey: function (node) {
            if (!node || node == "undefined") {
                logMessage('Error! You need a node to create any firebase key');
                return;
            }
            return firebaseBaseDatabase.ref().child(node).push().key;
        },

        /**
         *
         * @param params (String|Object)
         * @param callBackData function
         */
        deleteData: function (params, callBackData) {
            var path = params.path;
            var nodeRef = firebaseBaseDatabase.ref(path);

            if (!path || path == "undefined") {
                callBackData({error: 'path required to interact with Firebase findOne'});
            }

            nodeRef.on('value', function (snapshot) {
                var data = snapshot.val();
                if (!data.node_id) {
                    data.node_id = snapshot.key;
                }
                callBackData({data: data});
            }, function (error) {
                callBackData({error: error});
            });
        },

        /**
         *
         * @param params (String|Object)
         * @param callBackData function
         */
        saveData: function (params, callBackData) {
            var path = params.path;
            var objectData = params.data;
            var newGeneratedKey;

            if (!objectData.node_id) {
                newGeneratedKey = this.initKey(path);
            } else {
                newGeneratedKey = objectData.node_id;
            }

            if (!path) {
                callBackData({error: 'Node name required to interact with Firebase'});
            }

            if (!objectData.created || objectData.created == "undefined") {
                objectData.created = new Date().valueOf();
            }

            if (!objectData.node_id) {
                objectData.node_id = newGeneratedKey;
            }

            var created = objectData.created;
            firebaseBaseDatabase.ref(path).child(newGeneratedKey).set(objectData, function (error) {
                if (error) {
                    callBackData({error: error});
                } else {
                    callBackData({node_id: newGeneratedKey});
                }
            });
            firebaseBaseDatabase.ref(path).child(newGeneratedKey).setPriority('created');
        },

        /**
         *
         * @param params (String|Object)
         * @param callBackData function
         */
        updateData: function (params, callBackData) {
            var path = params.path;
            var objectData = params.data;

            if (!path) {
                callBackData({error: 'path required to interact with Firebase update'});
            }

            if (!objectData.modified || objectData.modified == "undefined") {
                objectData.modified = new Date().valueOf();
            }
            firebaseBaseDatabase.ref(path).update(objectData, function (error) {
                if (error) {
                    callBackData({error: error});
                } else {
                    callBackData('success');
                }
            });
        },

        /**
         *
         * @param params (String|Object)
         * @param callBackData function
         */
        findOne: function (params, callBackData) {
            var path = params.path;
            var listenerType = params.listenerType;
            var eventType = params.eventType;

            if(!listenerType || listenerType == "undefined"){
                listenerType = "on";
            }

            if(!eventType || eventType == "undefined"){
                eventType = "value";
            }

            var nodeRef = firebaseBaseDatabase.ref(path);

            if (!path) {
                callBackData({error: 'path required to interact with Firebase findOne'});
            }

            /**
             * Make request to firebase database and listen to changes
             */
            var definedFunction = function (snapshot) {
                var data = {};
                snapshot.forEach(function (childSnapshot) {
                    var snapshot = childSnapshot.val();
                    data[childSnapshot.key] = snapshot;
                });
                if (!data.node_id || data.node_id == undefined) {
                    data.node_id = snapshot.key;
                }
                callBackData(data);
            };

            var errorFunction = function (error) {
                callBackData({error: error});
            };


            if(listenerType == 'on'){
                onListener(nodeRef,eventType,definedFunction,errorFunction);
            }else if(listenerType == 'once'){
                onceListener(nodeRef,eventType,definedFunction,errorFunction);
            }else{
                console.error('**** Invalid listener type ('+listenerType+') specified. Forgot to specify on or once in params.listenerType ****');
            }
        },

        /**
         *
         * @param params (String|Object)
         * @param callBackData function
         */
        customQuery: function (params, callBackData) {
            var customRef = params.query;
            var listenerType = params.listenerType;
            var eventType = params.eventType;
            var nodeRef;

            if (!listenerType || listenerType == "undefined") {
                listenerType = "on";
            }

            if (!eventType || eventType == "undefined") {
                eventType = "value";
            }

            if (customRef && customRef != "") {
                nodeRef = customRef;
            } else {
                if (!path) {
                    callBackData({error: 'path required to interact with Firebase findOne'});
                }
                nodeRef = firebaseBaseDatabase.ref(path);
            }

            if (!listenerType || listenerType == "undefined") {
                listenerType = "on";
            }

            if (!eventType || eventType == "undefined") {
                eventType = "value";
            }

            /**
             * Make request to firebase database and listen to changes
             */
            var definedFunction = function (snapshot) {
                logMessage('**** Firebase database data return ****');
                var count = snapshot.numChildren();
                var response;

                var data = Array();
                snapshot.forEach(function (childSnapshot) {
                    var key = childSnapshot.key;
                    var childData = childSnapshot.val();
                    childData.key = key;
                    data.push(childData);
                });

                if (count > 0) {
                    response = true;
                } else {
                    response = false;
                }
                data.response = response;
                data.response_count = count;

                callBackData({data: data});
            };

            var errorFunction = function (error) {
                callBackData({error: error});
            };

            if (listenerType == 'on') {
                onListener(nodeRef, eventType, definedFunction, errorFunction);
            } else if (listenerType == 'once') {
                onceListener(nodeRef, eventType, definedFunction, errorFunction);
            } else {
                console.error('**** Invalid listener type (' + listenerType + ') specified. Forgot to specify on or once in params.listenerType ****');
            }
        },

        /**
         *
         * @param params (String|Object)
         * @param callBackData
         */
        findAll: function (params, callBackData) {
            var path = params.path;
            var limit = params.limit;
            var listenerType = params.listenerType;
            var eventType = params.eventType;
            var nodeRef;

            if (!listenerType || listenerType == "undefined") {
                listenerType = "on";
            }

            if (!eventType || eventType == "undefined") {
                eventType = "value";
            }

            if (limit && limit != "") {
                if (Math.floor(limit) == limit && $.isNumeric(limit)) {
                    nodeRef = firebaseBaseDatabase.ref(path).limitToLast(limit).orderByPriority();
                } else {
                    var data = Array();
                    data.error = true;
                    data.error_message = 'Limit as to be a int not a string';
                    callBackData({error: data});
                }
            } else {
                nodeRef = firebaseBaseDatabase.ref(path).orderByPriority();
            }

            /**
             * Make request to firebase database and listen to changes
             */
            var definedFunction = function (snapshot) {
                logMessage('**** Firebase database data return ****');
                var count = snapshot.numChildren();
                var response;

                var data = Array();
                snapshot.forEach(function (childSnapshot) {
                    var key = childSnapshot.key;
                    var childData = childSnapshot.val();
                    childData.key = key;
                    data.push(childData);
                });

                if (count > 0) {
                    response = true;
                } else {
                    response = false;
                }
                data.response = response;
                data.response_count = count;

                callBackData({data: data});
            };

            var errorFunction = function (error) {
                callBackData({error: error});
            };

            if (listenerType == 'on') {
                onListener(nodeRef, eventType, definedFunction, errorFunction);
            } else if (listenerType == 'once') {
                onceListener(nodeRef, eventType, definedFunction, errorFunction);
            } else {
                console.error('**** Invalid listener type (' + listenerType + ') specified. Forgot to specify on or once in params.listenerType ****');
            }
        },

        /**
         * Increment value
         */
        incrementValue: function (params, callBackData) {
            var path = params.path;
            var incrementBy = params.incrementBy;
            var nodeRef;

            if (!path) {
                callBackData({error: 'path required to interact with Firebase incrementValue'});
            } else if (!incrementBy) {
                callBackData({error: 'please add increment value'});
            } else {
                nodeRef = firebaseBaseDatabase.ref(path);
                nodeRef.transaction(function (onlineValue) {
                    var oldValue = onlineValue;
                    if (onlineValue) {
                        var intOnlineValue = parseInt(onlineValue);
                        onlineValue = intOnlineValue + parseInt(incrementBy);
                    } else {
                        onlineValue = 1;
                    }

                    if (oldValue != onlineValue) {
                        return onlineValue;
                    }
                }, function(error, committed) {
                    if (error) {
                        callBackData({error: 'incrementValue failed abnormally! '+error});
                    } else if (!committed) {
                        callBackData({error: 'incrementValue aborted'});
                    } else {
                        callBackData('incrementValue completed');
                    }
                });
            }
        },

        /**
         * path - path where you want to upload to
         * @param parameters
         */
        fileUpload: function (parameters, callBackData) {
            var file = parameters.file;
            var path = parameters.path;
            var name;

            var metaData = {'contentType': file.type};
            var arr = file.name.split('.');
            var fileSize = formatBytes(file.size);
            var fileType = file.type;
            var n = file.name;
            name = generateRandomString(12);

            //var fullPath = path + '/' + name + '.' + arr.slice(-1)[0];
            var fullPath = path + '/' + file.name;

            var uploadFile = storageRef.child(fullPath).put(file, metaData);

            callBackData({id: name, fileSize: fileSize, fileType: fileType, fileName: n});

            uploadFile.on('state_changed', function (snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progress = Math.floor(progress);
                callBackData({progress: progress, element: name, fileSize: fileSize, fileType: fileType, fileName: n});
            }, function (error) {
                callBackData({error: error});
            }, function () {
                var downloadURL = uploadFile.snapshot.downloadURL;
                callBackData({downloadURL: downloadURL, element: name, fileSize: fileSize, fileType: fileType, fileName: n});
            });
        },

        /**
         * Initiate Pagination
         */
        initLoadMore: function (params) {
            var p =params.path;
            var paginatorName = params.path;
            var pageLimit = params.pageLimit;

            if (!paginatorName) {
                logMessage("path is required");
                return false;
            }
            if (!pageLimit) {
                logMessage("You need to specify a page limit");
                return false;
            }

            localStorage.setItem(p+'_paginatorName', paginatorName);
            localStorage.setItem(paginatorName + '-linkKey', '');
            localStorage.setItem(paginatorName + '-pageLimit', params.pageLimit);
            localStorage.setItem(paginatorName + '-pageCount', 0);
            localStorage.setItem(paginatorName + '-path', params.path);

            return FirebaseService;
        },

        /**
         * Load more pagination
         */
        loadMore: function (params, callBackData) {
            var p = params.path;

            var paginatorName = localStorage.getItem(p+'_paginatorName');
            var path = localStorage.getItem(paginatorName + '-path');
            var pageCount = parseInt(localStorage.getItem(paginatorName + '-pageCount'));
            var pageLimit = parseInt(localStorage.getItem(paginatorName + '-pageLimit'));
            var linkKey = localStorage.getItem(paginatorName + '-linkKey');

            var caterCount = pageLimit + 1;

            var nodeRef;

            if (!path) {
                callBackData({error: 'path required'});
            } else if (!pageLimit) {
                callBackData({error: 'You need to specify a limit'});
            } else if (pageLimit < 2) {
                callBackData({error: 'You need to minimum limit of 2'});
            } else {
                pageCount++;
                if (linkKey == '') {
                    nodeRef = firebase.database().ref(path).orderByKey().limitToLast(caterCount);
                } else {
                    nodeRef = firebase.database().ref(path).orderByKey().limitToLast(caterCount).endAt(linkKey);
                    caterCount = caterCount * pageCount;
                }
            }

            var callBackResponseState;
            FirebaseService.customQuery({
                query: nodeRef,
                listenerType: 'once',
                eventType: 'value',
            }, function (response) {
                response.data.reverse();
                var isLastItem = setLastKey(paginatorName, response);
                var chunkData = response.data.chunk_inefficient(pageLimit);
                response.data = chunkData[0];

                if (isLastItem == false) {
                    callBackResponseState = {data: response.data};
                } else {
                    callBackResponseState = {error: 'No more data to fetch'};
                }
                callBackData(callBackResponseState);
            });
        },

    });

    function onListener(nodeRef, value, definedFunction, errorFunction) {
        nodeRef.on(value, definedFunction, errorFunction)
    }

    function onceListener(nodeRef, value, definedFunction, errorFunction) {
        nodeRef.once(value, definedFunction, errorFunction)
    }

    setLastKey = function (modifiedData) {
        var countReturned = modifiedData.data.length;
        var lastOne = 0;
        var lastItem = false;
        if(countReturned > 0){
            lastOne = countReturned - 1;
        }
        var lastObject = modifiedData.data[lastOne];
        var lastItem = (linkKey == lastObject.key);
        if(linkKey == lastObject.key){
            lastItem = true;
        }else{
            lastItem = false;
        }

        logMessage("linkKey",linkKey,"lastObject",lastObject.key);

        if(lastObject != null){
            linkKey = lastObject.key.toString();
        }


        return lastItem;
    };

    Object.defineProperty(Array.prototype, 'chunk_inefficient', {
        value: function(chunkSize) {
            var array=this;
            return [].concat.apply([],
                array.map(function(elem,i) {
                    return i%chunkSize ? [] : [array.slice(i,i+chunkSize)];
                })
            );
        }
    });

    function formatBytes(bytes, decimals) {
        if (bytes == 0) return '0 Byte';
        var k = 1000;
        var dm = decimals + 1 || 3;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    /**
     *
     */
    if (firebaseBaseDatabase != null) {
        FirebaseService = new FirebaseDataModel();
    }

} else {
    logMessage('**** Firebase inactive, Activate by un-comment line 21 in the app index.html  **** ');
}