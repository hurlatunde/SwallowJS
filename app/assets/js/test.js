(function ($) {
    "use strict";

    // const KEY = 'wertghredh4wr';/

    // getaccesUrl();


    // function getaccesUrl() {
    //
    //     fetch('').then(response => response.json()).then(res => store.dispatch({ type: 'DATA FETCHED', data: res}));
    // }


    // saveTracks('dfghjkl;');
    //
    //

    swallowObserver.subscribe(function(data){
        console.log(data)
    });




    swallowBroadcast({type: 'INCREMENT'});
    store.dispatch({type: 'INCREMENT'});
    store.dispatch({type: 'INCREMENT'});
    store.dispatch({type: 'INCREMENT'});
    store.dispatch({type: 'INCREMENT'});

})(jQuery);