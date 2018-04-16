/**
 *
 * @param state
 * @constructor
 */
var FirestoreService;
FireStoreDataModel = function () {
    // var mainApp = firebase.initializeApp(firebaseConfig);

    /**
     * Connecting to Firebase database system
     */
    this.firebaseFirestore = mainApp.firestore();
    this.defer = $.Deferred();
};

$.extend(FireStoreDataModel.prototype, {
    saveData: function (params, callback) {
        var path = params.path;
        var objectData = params.data;

        if (!objectData.created || objectData.created == "undefined") {
            objectData.created = new Date().valueOf();
        }
        this.firebaseFirestore.collection(path).add(objectData).then(function (docRef) {
            return callback({node: docRef.id});
        }).catch(function (error) {
            return callback({error: error});
        });
    }
});
FirestoreService = new FireStoreDataModel();