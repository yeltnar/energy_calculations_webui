import getQueryParemeters from './getQueryParameters';
export const {getData, getDataNow} = (()=>{

  let body;
  let pending = (async function(){

    if(typeof window === 'undefined')
    {
      // Your client-side code that uses window goes here
      console.log('findmedrew a');
      return null
    }

    // let url = `http://localhost:3000`;
    let url = `https://energy-calculations.mini.lan`;

    let {
      i,
      start,
      end,
      all,
      most_recent,
      most_recent_count,
      index,
      days_after,
      days_before,
    } = getQueryParemeters();

    let passthrough_parameters = {
      i,
      start,
      end,
      most_recent_count,
      index,
      days_after,
      days_before,
    };

    if (all !== undefined) { 
      url = `${url}/all`;
    } else if(most_recent !== undefined){
      url = `${url}/most_recent`;
    }else {

      for( let k in passthrough_parameters){
        let cur = passthrough_parameters[k];
        if (cur !== undefined) {
          const s = url.includes('?') ? "&" : "?";
          url = `${url}${s}${k}=${cur}`;
        }
      }

    }


    if (index !== undefined ) {
        const s = url.includes('?') ? "&" : "?";
        url = `${url}${s}index=${index}`;
    }
    if (i !== undefined || window.location.pathname.includes('graph') ) {
        const s = url.includes('?') ? "&" : "?";
        url = `${url}${s}i=${i||'true'}`;
    }
    if( most_recent_count !== undefined ){
        const s = url.includes('?') ? "&" : "?";
        url = `${url}${s}most_recent_count=${most_recent_count}`;
    }

    const resp = await fetch(url);
    body = await resp.json();


    if( body.results.individual_data !== undefined ){
        body.results.individual_data = body.results.individual_data.sort((a, b)=>{
            if(a.ms<b.ms){
                return -1;
            }else if(a.ms>b.ms){
                return 1;
            }else{
                return 0;
            }
        });
    }

    return body;
  })();

  async function getData(){
    return await pending;
  }

  function getDataNow(){
    return body;
  }

  return {
    getData,
    getDataNow,
  };

})();

export default getData;
