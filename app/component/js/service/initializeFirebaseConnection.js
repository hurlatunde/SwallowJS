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

var firebaseBaseDatabase;
var FirebaseModal;

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

FirebaseDataModal = function() {
    //this.init(name_var);
};

$.extend(FirebaseDataModal.prototype, {
    // object variables
    //widget_name: '',

    /**
     *
     * @param node
     * @return {*|string}
     */
    initKey: function(node) {
        if (!node) {
            logMessage('Error! You need a node to create any firebase key');
            return;
        }
        return firebaseBaseDatabase.ref().child(node).push().key;
    },

    /**
     *
     * @param params
     * @param callBackData
     */
    deleteData: function (params, callBackData) {
        var path = params.path;
        var nodeRef = firebaseBaseDatabase.ref(path);

        if (!path) {
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
     * @param callBackData
     */
    saveData: function (params, callBackData) {
        var node = params.node;
        var objectData = params.data;
        var newGeneratedKey = this.initKey(node);

        if (!node) {
            callBackData({error: 'Node name required to interact with Firebase'});
        }

        if (!objectData.created) {
            objectData.created = new Date().valueOf();
        }
        objectData.node_id = newGeneratedKey;

        firebaseBaseDatabase.ref(node).child(newGeneratedKey).set(objectData, function (error) {
            callBackData({error: error});
        });
    },

    /**
     *
     * @param params (String|Object)
     * @param callBackData
     */
    updateData: function (params, callBackData) {
        var path = params.path;
        var objectData = params.data;

        if (!path) {
            callBackData({error: 'path required to interact with Firebase update'});
        }

        if (!objectData.modified) {
            objectData.modified = new Date().valueOf();
        }
        firebaseBaseDatabase.ref(path).update(objectData, function (error) {
            callBackData({error: error});
        });
    },


    /**
     *
     * @param params
     * @param callBackData
     */
    findOne: function (params, callBackData) {
        var path = params.path;
        var nodeRef = firebaseBaseDatabase.ref(path);

        if (!path) {
            callBackData({error: 'path required to interact with Firebase findOne'});
        }

        logMessage(nodeRef);

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
     * @param params
     * @param callBackData
     */
    findAll: function(params, callBackData) {
        var path = params.path;
        var limit = params.limit;
        var nodeRef;

        if (limit && limit != "") {
            if(Math.floor(limit) == limit && $.isNumeric(limit)) {
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

            callBackData({data: data});
        }, function (error) {
            callBackData({error: error});
        });
    }
});

/**
 *
 */
if (firebaseBaseDatabase != null) {
    FirebaseModal = new FirebaseDataModal();
}