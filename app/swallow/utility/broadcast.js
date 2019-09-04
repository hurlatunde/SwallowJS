// /**
//  *
//  **/
// var swallowBroadcast;
// // var swallowObserver;
// // var store;
// // const store = Redux.createStore(Redux.combineReducers({
// //         count: count
// //     }));


// // var store;
// //
// // var swallowObserver = new Rx.BehaviorSubject(store.getState());

// function count(state, action) {
//     if (state === undefined) return 0;
//     switch (action.type) {
//         case 'INCREMENT':
//             if (action.data) return state + 5;
//             return state + 1;
//         case 'DECREMENT':
//             return state - 1;
//         default:
//             return state;
//     }
// }

// // store = Redux.createStore(Redux.combineReducers({
// //     count: count
// // }));

// //var swallowObserver = new Rx.BehaviorSubject(store.getState());

// *
//  * Broadcast
//  * @constructor
 
// Broadcast = function (state) {
//     this.store = Redux.createStore(Redux.combineReducers({
//         state: state
//     }));
//     this.observer = new Rx.BehaviorSubject(this.store.getState());
//     // console.log(this.observer);
// };

// $.extend(Broadcast.prototype, {
//     init: function () {
//         var self = this;
//         this.store.subscribe(function () {
//             self.observer.next(self.store.getState());
//         })
//     },
//     subscribe: function (callback) {
//         this.observer.subscribe(callback)
//     },
//     setBroadcast: function (obj) {
//         this.store.dispatch({type: obj.type, data: obj.data});
//     }
// });

// swallowBroadcast = new Broadcast(count);
// swallowBroadcast.init();
// 


let INCLUDE_ELEMENT = "includeElement";

let actions = {
    didLoad: function (node_id) {
        return {
            type: INCLUDE_ELEMENT, data: {
                'node_id': node_id,
                'element': `includeElement_${node_id}`,
                'status': `didLoad`
            }
        }
    },
    willLoad: function (node_id) {
        return {
            type: INCLUDE_ELEMENT, data: {
                'node_id': node_id,
                'element': `includeElement_${node_id}`,
                'status': `willLoad`
            }
        }
    }
}


const INIT_STATE = {
    node_id: false,
    element: false,
    status: false
};

let elements = function (state = INIT_STATE, action) {
    if (state === undefined) return {};

    switch (action.type) {
        case INCLUDE_ELEMENT:
            console.log("******", Object.assign(state, action.data))
            state = Object.assign(action.data);
            return state
        default:
            return state;
    }
}

let store = Redux.createStore(Redux.combineReducers({
    elements: elements
}));
// let observable = new Rx.BehaviorSubject(store.getState());
let swDispatch = {

    observableCl: function (node) {
       return new Rx.BehaviorSubject(node)
    },

    init: function (store) {
        let self = this
    },

    observeStore: function (store) {
        let currentState;
        let self = this;

        function handleChange() {
            let storeState = store.getState();
            swDispatch.observable.next(storeState)
        }

        let unsubscribe = store.subscribe(handleChange);
        handleChange();
        return unsubscribe;
    },

    dispatch: function (obint, obj) {
        obint.next(obj)
        return obint
    }

}

swDispatch.init(store)