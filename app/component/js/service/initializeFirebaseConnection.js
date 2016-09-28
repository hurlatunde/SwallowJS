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
    logMessage('**** Firebase database config ****');

    var mainApp = firebase.initializeApp(firebaseConfig);
    /**
     * Connecting to Firebase database system
     */
    firebaseBaseDatabase = mainApp.database();
} else {
    firebaseBaseDatabase = null;
}

FirebaseDataModal = function(name_var) {
    this.init(name_var);

    function callBackResponse(params) {

    }
};

$.extend(FirebaseDataModal.prototype, {
    // object variables
    widget_name: '',

    init: function(widget_name) {
        // do initialization here
        this.widget_name = widget_name;
    },

    /**
     *
     * @param params
     * @param callBackData
     */
    delete: function (params, callBackData) {

    },

    /**
     *
     * @param params
     * @param callBackData
     */
    update: function (params, callBackData) {

    },

    /**
     *
     * @param params
     * @param callBackData
     */
    save: function (params, callBackData) {

    },

    /**
     *
     * @param params
     * @param callBackData
     */
    findOne: function (params, callBackData) {

    },

    /**
     *
     * @param params
     * @param callBackData
     */
    findAll: function(params, callBackData) {
        var node = params.node;
        var limit = params.limit;
        var nodeRef;

        if (limit && limit != "") {
            if(Math.floor(limit) == limit && $.isNumeric(limit)) {
                nodeRef = firebaseBaseDatabase.ref(node).limitToLast(limit);
            } else {
                var data = Array();
                data.error = true;
                data.error_message = 'Limit as to be a int not a string';
                callBackData({error: data});
            }
        } else {
            nodeRef = firebaseBaseDatabase.ref(node);
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


FirebaseModal = new FirebaseDataModal('widget one');