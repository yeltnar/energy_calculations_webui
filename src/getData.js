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
    let i = new URLSearchParams(window.location.search).get("i");
    // let i = 'true';// new URLSearchParams(window.location.search).get("i");
    let start = new URLSearchParams(window.location.search).get("start");
    let end = new URLSearchParams(window.location.search).get("end");
    let all = new URLSearchParams(window.location.search).get("all");
    let most_recent = new URLSearchParams(window.location.search).get("most_recent");
    let most_recent_count = new URLSearchParams(window.location.search).get("most_recent_count");
    let index = new URLSearchParams(window.location.search).get("index");

    if (all !== null) {
      url = `${url}/all`;
    } else if(most_recent !== null){
      url = `${url}/most_recent`;
    }else {
      if (start !== null) {
        const s = url.includes('?') ? "&" : "?";
        url = `${url}${s}start=${start}`;
      }
      if (end !== null) {
        const s = url.includes('?') ? "&" : "?";
        url = `${url}${s}end=${end}`;
      }
    }


    if (index !== null ) {
        const s = url.includes('?') ? "&" : "?";
        url = `${url}${s}index=${index}`;
    }
    if (i !== null || window.location.pathname.includes('graph') ) {
        const s = url.includes('?') ? "&" : "?";
        url = `${url}${s}i=${i||'true'}`;
    }
    if( most_recent_count !== null ){
        const s = url.includes('?') ? "&" : "?";
        url = `${url}${s}most_recent_count=${most_recent_count}`;
    }

    console.log({findmedrew:url});

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
