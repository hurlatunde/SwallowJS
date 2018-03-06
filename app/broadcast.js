/**
 *
 **/
var swallowBroadcast;
// var swallowObserver;
// var store;
// const store = Redux.createStore(Redux.combineReducers({
//         count: count
//     }));


// var store;
//
// var swallowObserver = new Rx.BehaviorSubject(store.getState());

function count(state, action) {
    if (state === undefined) return 0;
    switch (action.type) {
        case 'INCREMENT':
            if (action.data) return state + 5;
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
}

// store = Redux.createStore(Redux.combineReducers({
//     count: count
// }));

//var swallowObserver = new Rx.BehaviorSubject(store.getState());

/**
 * Broadcast
 * @constructor
 */
Broadcast = function (state) {
    this.store = Redux.createStore(Redux.combineReducers({
        state: state
    }));
    this.observer = new Rx.BehaviorSubject(this.store.getState());
    // console.log(this.observer);
};

$.extend(Broadcast.prototype, {
    init: function () {
        var self = this;
        this.store.subscribe(function () {
            self.observer.next(self.store.getState());
        })
    },
    subscribe: function (callback) {
        this.observer.subscribe(callback)
    },
    setBroadcast: function (obj) {
        this.store.dispatch({type: obj.type, data: obj.data});
    }
});

swallowBroadcast = new Broadcast(count);
swallowBroadcast.init();