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
 * @package       component.js.service.initializeFirebaseConnection.js
 * @since         SwallowJs(tm) v 0.2.9
 */

if (typeof firebase !== 'undefined') {

    var firebaseBaseDatabase;
    var FirebaseService;
    var findSingleData = {};

    /**
     * Check if firebase is configure
     */
    if (firebaseConfig.apiKey != 'APP-API-KEY' || firebaseConfig.databaseURL != 'APP-DATABASE-URL') {
        logMessage('**** Firebase database config. ****');
        var mainApp = firebase.initializeApp(firebaseConfig);

        /**
         * Connecting to Firebase database system
         */
        firebaseBaseDatabase = mainApp.database();
    } else {
        firebaseBaseDatabase = null;
        logMessage('**** Firebase database not config yet ****');
    }

    function firebaseObjectToArray(childSnapshot) {
        var key = childSnapshot.key;
        var childData;
        if(typeof childSnapshot.val == 'function'){
            childData = childSnapshot.val();
        }else{
            childData = childSnapshot;
        }

        if( typeof childData === "object" ) {
            var innerdata = Array();
            for (var dataSet in childData){
                var childDataObject = childData[dataSet];
                var innerSetData = Array();
                for (var childSet in childDataObject) {
                    var innerChildDataObject = childDataObject[childSet];
                    if( typeof innerChildDataObject === "object" ) {
                        var dataReturn =  firebaseObjectToArrayInner(innerChildDataObject);
                        //innerSetData.push(dataReturn);
                    } else {
                        //innerSetData.push(innerChildDataObject);
                    }
                }
                //logMessage(innerSetData);
                //innerdata.push(innerSetData);

                // if( typeof childDataObject === "object" ) {
                //     //var key = dataSet.key;
                //     //var childData = dataSet.val();
                //     //this.firebaseObjectToArray(key, childData);
                // } else {
                //     innerdata.push(childDataObject);
                // }
                //logMessage(childDataObject);
            }
            findSingleData[key] = innerdata;
        } else {
            findSingleData[key] = childData;
        }
        //logMessage(data);
        return findSingleData;
    }

    function firebaseObjectToArrayInner(innerChildDataObject) {
        var innerData = Array();
        for (var dataSet in innerChildDataObject){
            var childDataObject = innerChildDataObject[dataSet];

            var innerChildDataObject = {};
            for (var dataInnerSet in childDataObject){
                var innerChildDataSet = childDataObject[dataInnerSet];
                // logMessage(dataInnerSet);
                // logMessage(innerChildDataSet);
                innerChildDataObject[dataInnerSet] = innerChildDataSet;
                // if( typeof innerChildDataSet === "object" ) {
                //
                // } else {
                //     innerChildDataObject.push(innerChildDataSet);
                // }
            }
            logMessage(innerChildDataObject);

            //innerData.push(innerChildDataObject);
        }
        //logMessage(innerData);
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
            var newGeneratedKey = this.initKey(path);

            if (!path) {
                callBackData({error: 'Node name required to interact with Firebase'});
            }

            if (!objectData.created || objectData.created == "undefined") {
                objectData.created = new Date().valueOf();
            }
            objectData.node_id = newGeneratedKey;

            //return id evey save

            firebaseBaseDatabase.ref(path).child(newGeneratedKey).set(objectData, function (error) {
                callBackData({error: error});
            });
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
                callBackData({error: error});
            });
        },


        /**
         *
         * @param params (String|Object)
         * @param callBackData function
         */
        findOne: function (params, callBackData) {
            var path = params.path;
            var nodeRef = firebaseBaseDatabase.ref(path);

            if (!path) {
                callBackData({error: 'path required to interact with Firebase findOne'});
            }

            nodeRef.on('value', function (snapshot) {
                var see = snapshot.val();

                //var data;
                snapshot.forEach(function (childSnapshot) {
                    // var key = childSnapshot.key;

                    // logMessage(childSnapshot);
                    // logMessage(childSnapshot.key);

                    // var childData = childSnapshot.val();
                    // logMessage(childData);
                    // return
                    firebaseObjectToArray(childSnapshot);
                    //logMessage(data);
                    // } else {
                    //     data[key] = childData;
                    // }
                });

                //logMessage(findSingleData);
                return;

                // logMessage(data);
                // for (i = 0; i < data.length; i++){
                //     logMessage(data[i]);
                // }

                // snapshot.forEach(function (childSnapshot) {
                //     var childData = childSnapshot.val();
                //     childData.key = childSnapshot.key;
                //     //data.push(childData);
                // });
                // if( (typeof A === "object") && (A !== null) )
                // {
                //     alert("A is object");
                // }

                if (!data.node_id || data.node_id == undefined) {
                    data.node_id = snapshot.key;
                }
                callBackData(data);
            }, function (error) {
                callBackData({error: error});
            });
        },

        /**
         *
         * @param params (String|Object)
         * @param callBackData
         */
        findAll: function (params, callBackData) {
            var path = params.path;
            var limit = params.limit;
            var nodeRef;

            if (limit && limit != "") {
                if (Math.floor(limit) == limit && $.isNumeric(limit)) {
                    nodeRef = firebaseBaseDatabase.ref(path).limitToLast(limit);
                } else {
                    var data = Array();
                    data.error = true;
                    data.error_message = 'Limit as to be a int not a string';
                    callBackData({error: data});
                }
            } else {
                nodeRef = firebaseBaseDatabase.ref(path);
            }

            /**
             * Make request to firebase database and listen to changes
             */
            nodeRef.on('value', function (snapshot) {
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

                callBackData({data:data});
            }, function (error) {
                callBackData({error: error});
            });
        }
    });

    /**
     *
     */
    if (firebaseBaseDatabase != null) {
        FirebaseService = new FirebaseDataModel();
    }

} else {
    logMessage('**** Currently not using Firebase. Activate by un-comment line 28 in the app index.html **** ');
}