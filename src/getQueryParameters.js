const getQueryParemeters = (() => {

    let the_thing;

    function getQueryParameters() {

        if(typeof window === 'undefined'){
          return undefined;
        }

        if(the_thing!==undefined){
            return the_thing;
        }

        the_thing = {};

        const x = new URLSearchParams(window.location.search);
        const entries = x.entries();
        let qp = {};
        do {
            qp = entries.next();
            if (qp.done === false) {
                const key = qp.value[0];
                const value = qp.value[1];
                the_thing[key] = value;
            }
        } while (qp.done === false)
        return the_thing;
    }

    if (typeof window !== 'undefined') {
        window.addEventListener('load', () => { getQueryParameters });
    }

    return getQueryParameters;

})();

export default getQueryParemeters;
