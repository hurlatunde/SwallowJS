/**
 *
 **/

var dd;

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

function swallowBroadcast(obj) {
    store.dispatch({type: obj.type, data: obj.data});
}

const store = Redux.createStore(Redux.combineReducers({
    count: count
}));

// var globalObserver = Rx.Observable.create(function (observer) {
//     observer.next(store.getState());
// });

var swallowObserver = new Rx.BehaviorSubject(store.getState());

function onRecBroadcast() {
//     // console.log();
//     // console.log('callback', callback)
    swallowObserver.next(store.getState());
}

// function onRecBroadcastSetter() {
//     const d = store.getState().count.toString();
//     logMessage(store.getState().count.toString());
//     dd = d;
// }

store.subscribe(onRecBroadcast);