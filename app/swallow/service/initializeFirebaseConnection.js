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

    function getCurrentUser() {
        var user = firebase.auth().currentUser;
        if (user) {
            return user;
        } else {
            return false;
        }
    }

    var firebaseBaseDatabase;
    var FirebaseService;

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
        var childData;
        if(typeof childSnapshot.val == 'function'){
            childData = childSnapshot.val();
        }else{
            childData = childSnapshot;
        }

        var innerdata = Array();

        for (var dataSet in childData){
            var innerSetData = {};
            var childDataObject = childData[dataSet];

            for (var childSet in childDataObject) {
                var innerChildDataObject = childDataObject[childSet];
                if( typeof innerChildDataObject === "object" ) {
                    var dataReturn =  firebaseObjectToArrayInner(innerChildDataObject);
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
        for (var dataSet in innerChildDataObject){
            var childDataObject = innerChildDataObject[dataSet];

            var innerChildDataObjectSet = {};
            for (var dataInnerSet in childDataObject){
                var innerChildDataSet = childDataObject[dataInnerSet];
                if( typeof innerChildDataSet === "object" ) {
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
            var newGeneratedKey = this.initKey(path);

            if (!path) {
                callBackData({error: 'Node name required to interact with Firebase'});
            }

            if (!objectData.created || objectData.created == "undefined") {
                objectData.created = new Date().valueOf();
            }
            objectData.node_id = newGeneratedKey;

            //remember return id from every save
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
            var customQuery = params.custom;
            var listenerType = params.listenerType;
            var eventType = params.eventType;

            if(!listenerType || listenerType == "undefined"){
                listenerType = "on";
            }

            if(!eventType || eventType == "undefined"){
                eventType = "value";
            }

            if(customQuery){
                var nodeRef = firebaseBaseDatabase.ref(path)+customQuery;
            } else {
                var nodeRef = firebaseBaseDatabase.ref(path)
            }

            if (!path) {
                callBackData({error: 'path required to interact with Firebase findOne'});
            }

            var definedFunction = function (snapshot) {
                var data = {};
                snapshot.forEach(function (childSnapshot) {
                    var snapshot = childSnapshot.val();
                    if( typeof snapshot === "object" ) {
                        data[childSnapshot.key] = firebaseObjectToArray(snapshot);
                    } else {
                        data[childSnapshot.key] = snapshot;
                    }
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
         * @param callBackData
         */
        findAll: function (params, callBackData) {
            var path = params.path;
            var limit = params.limit;
            var customQuery = params.customRef;
            var listenerType = params.listenerType;
            var eventType = params.eventType;
            var nodeRef;



            if(!listenerType || listenerType == "undefined"){
                listenerType = "on";
            }

            if(!eventType || eventType == "undefined"){
                eventType = "value";
            }


            if(customQuery && customQuery != ""){
                nodeRef = customQuery;
            } else {
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

                if(count > 0) {
                    response = true;
                } else {
                    response = false;
                }
                data.response = response;
                data.response_count = count;

                callBackData({data:data});
            };

            var errorFunction =  function (error) {
                callBackData({error: error});
            };

            if(listenerType == 'on'){
                onListener(nodeRef,eventType,definedFunction,errorFunction);
            }else if(listenerType == 'once'){
                onceListener(nodeRef,eventType,definedFunction,errorFunction);
            }else{
                console.error('**** Invalid listener type ('+listenerType+') specified. Forgot to specify on or once in params.listenerType ****');
            }
        }
    });


    function onListener(nodeRef,value,definedFunction,errorFunction) {
        nodeRef.on(value,definedFunction,errorFunction)
    }

    function onceListener(nodeRef,value,definedFunction,errorFunction) {
        nodeRef.once(value,definedFunction,errorFunction)
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