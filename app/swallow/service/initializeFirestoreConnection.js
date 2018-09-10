/**
 *
 * @param state
 * @constructor
 */
var FirestoreService;
FireStoreDataModel = function () {
    // var mainApp = firebase.initializeApp(firebaseConfig);

    /**
     * Connecting to Firebase firestore system
     */
    this.firebaseFirestore = mainApp.firestore();
    this.defer = $.Deferred();
    this.collectionInstance = false;
    this.dferred = new $.Deferred();

};

$.extend(FireStoreDataModel.prototype, {
    saveDataee: function (params) {
        var path = params.path;
        var objectData = params.data;

        if (!objectData.created || objectData.created == "undefined") {
            objectData.created = new Date().valueOf();
        }

        return this.firebaseFirestore.collection(path).add(objectData);
        //.then(function (docRef) {
        //return callback({node: docRef.id});
        // }).catch(function (error) {
        //return callback({error: error});
        //});


        // this.firebaseFirestore.collection(path).add(objectData).then(function (docRef) {
        //     return callback({node: docRef.id});
        // }).catch(function (error) {
        //     return callback({error: error});
        // });
    },

    /**
     * https://firebase.google.com/docs/firestore/query-data/queries#simple_queries
     * @param collection
     * @param params
     */
    findOne: function (collection, params) {
        if (!collection || collection === "undefined") {
            return this.dferred.reject('You need to set collection as the first parameter before making any queries');
        }
        if (!params || params === "undefined") {
            return this.dferred.reject('No params to making any queries');
        }

        if ((!params.where || params.where === "undefined") && (!params.id || params.id === "undefined")) {
            return this.dferred.reject('You need to set collection queries, like "where" or "id"');
        }

        let where = params.where;
        let id = params.id;
        let self = this;

        return self.initFindOneQuery(collection, {'where': where, 'id': id}).then(function (res) {
            if (!id || id === "undefined") {
                let doc = res.docs[0];
                return self.dferred.resolve($.extend(doc.data(), {id: doc.id}));
            } else {
                return res.data();
            }
        }).catch(function (error) {
            return self.dferred.reject(error);
        });
    },

    findAll: function (collection, params) {
        if (!collection || collection === "undefined") {
            return {error: 'You need to a set collection as the first parameter before making any queries'};
        }

        var where = params.where;
        var orderBy = params.orderBy;
        var limit = params.limit;

        // logMessage('typeof', where);
        // logMessage('typeof', $.isArray(where));
        //
        // if (!where || where === "undefined") {
        //     return {error: 'You need to a set collection as the first parameter before making any queries'};
        // } else {
        //     if (!$.isArray(where)) {
        //         return {error: 'You need to a set collection as the first parameter before making any queries'};
        //     }
        // }

        // if (!orderBy || orderBy === "undefined") {
        //     orderBy = "created_at";
        // }

        if (!limit || limit === "undefined") {
            limit = 20;
        } else {
            limit = parseInt(limit);
        }

        let self = this;
        return self.initCollectionWithQueries(collection, {
            'where': where,
            'orderBy': orderBy,
            'limit': limit
        }).then(function (res) {
            logMessage('**** Firebase firestore store data return ****');
            let count = res.size;
            let response = res.empty;

            let data = Array();
            res.docs.forEach(function (childSnapshot) {
                let key = childSnapshot.id;
                let childData = childSnapshot.data();
                childData.key = key;
                data.push(childData);
            });

            if (count > 0) {
                response = true;
            } else {
                response = false;
            }

            return self.dferred.resolve({data: data, response: response, response_count: count});
        }).catch(function (error) {
            return self.dferred.reject(error);
        });
    },

    /**
     * https://firebase.google.com/docs/firestore/manage-data/add-data?authuser=0
     * @param collection
     * @param objectData
     * @param doc
     * @param query
     */
    saveUpdate: function (collection, objectData, doc, query) {

        let self = this;
        if (!doc || doc === "undefined") {
            /**
             * Creating new collection
             */
            if (!objectData.created_at || objectData.created_at === "undefined") {
                objectData.created_at = new Date().valueOf();
                objectData.modified_at = new Date().valueOf();
            }

            return self.initCreate(collection, objectData).then(function (docRef) {
                console.log(objectData);
                if (!objectData.node_id || objectData.node_id === "undefined") {
                    return self.dferred.resolve({'node_id': docRef.id});
                } else {
                    return self.dferred.resolve({'node_id': objectData.node_id});
                }
            }).catch(function (error) {
                return self.dferred.reject(error);
            });
        } else {
            /**
             * updating collection
             */
            objectData.modified_at = new Date().valueOf();
            return self.initUpdate(collection, doc, objectData).then(function () {
                return self.dferred.resolve('Document successfully updated!');
            }).catch(function (error) {
                return self.dferred.reject(error);
            });
        }
    },

    initCollection: function (collection) {
        return this.firebaseFirestore.collection(collection);
    },
    initQueryById: function (collection, id) {
        return this.initCollection(collection).doc(id).get();
    },
    initFindOneQuery: function (collection, queries) {
        if (!queries.id || queries.id === "undefined") {
            this.collectionInstance = this.initCollection(collection);
            let whereQuery = queries.where;
            this.collectionInstance = this.whereLoop(whereQuery);
            return this.collectionInstance.get();
        } else {
            return this.initQueryById(collection, queries.id);
        }
    },
    initCollectionWithQueries: function (collection, queries) {
        let self = this;
        self.collectionInstance = self.initCollection(collection);

        //var initCollection;
        let whereQuery = queries.where;
        let orderByQuery = queries.orderBy;
        let limitQuery = queries.limit;

        // for (let i in whereQuery) {
        //     let whereStatement = whereQuery[i];
        //     // if (typeof whereStatement === 'string') {
        //     //     return {error: 'The WHERE query needs to be an array'};
        //     // }
        //     // if (whereQuery.length !== 3) {
        //     //     return {error: 'The WHERE query needs to be 3 argument, but ' + whereQuery.length + ' was given'};
        //     // }
        //
        //     initCollection = initCollection.where(whereStatement[0], whereStatement[1], whereStatement[2]);
        // }


        var query = self.collectionInstance;
        /**
         * whereQuery
         */
        if (whereQuery !== undefined) {
            query = self.collectionInstance = self.whereLoop(whereQuery);
        }
        /**
         * orderByQuery
         */
        if (orderByQuery !== undefined) {
            query = self.collectionInstance.orderBy(orderByQuery);
        }

        return query.limit(limitQuery).get();
        //self.collectionInstance = self.whereLoop(whereQuery);

        // switch(whereQuery) {
        //     case "undefined":
        //         return self.initCollection(collection).orderBy(orderByQuery).limit(limitQuery).get();
        //         break;
        //     default:
        //         self.collectionInstance = self.initCollection(collection);
        //         self.collectionInstance = self.whereLoop(whereQuery);
        //         return self.collectionInstance.orderBy(orderByQuery).limit(limitQuery).get();
        // }

        // if (whereQuery === "undefined") {
        //
        // } else {
        // }

        // if (queries.orderBy !== "undefined") {
        // } else {
        //     return this.collectionInstance.limit(queries.limit).get();
        // }

        // return;
        //
        // if (whereQuery.length === 1) {
        //     if (typeof whereQuery[0] === 'string') {
        //         return {error: 'The WHERE query needs to be an array'};
        //     }
        //     // let whereStatement = '"'+whereQuery[0].join('" , "')+'"';
        //     let whereStatement = whereQuery[0];
        //     logMessage('initCollection', whereStatement);
        //     logMessage('initCollection', whereStatement.split(','));
        //     // initCollection = this.initCollection(collection).where("user_id", "==", "D3AhIWLbYSUsbgV506qMSIzOJpD2")
        //     initCollection = this.initCollection(collection).where(whereStatement.split(','))
        // } else {
        //     //logMessage(initCollection);
        //     //logMessage('intSingleWhere', whereQuery);
        // }
    },
    whereLoop: function (whereQuery) {
        let self = this;
        var query = self.collectionInstance;

        var count = 0;
        for (let i in whereQuery) {
            let whereStatement = whereQuery[i];

            // if (typeof whereStatement === 'string') {
            //     return {error: 'The WHERE query needs to be an array'};
            // }
            // if (whereQuery.length !== 3) {
            //     return {error: 'The WHERE query needs to be 3 argument, but ' + whereQuery.length + ' was given'};
            // }

            query = query.where(whereStatement[0], whereStatement[1], whereStatement[2]);
            count++;
            if (whereQuery.length === count) {
                return query;
            }
        }
    },
    initUpdate: function (collection, doc, objectData) {
        return this.initCollection(collection).doc(doc).update(objectData);
    },
    initCreate: function (collection, objectData) {
        if (!objectData.node_id || objectData.node_id === "undefined") {
            return this.initCollection(collection).add(objectData);
        } else {
            const node_id = objectData.node_id;
            return this.initCollection(collection).doc(node_id).set(objectData);
        }
    }

});
FirestoreService = new FireStoreDataModel();