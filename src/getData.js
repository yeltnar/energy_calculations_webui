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
    let index = new URLSearchParams(window.location.search).get("index");

    if (all !== null) {
      url = `${url}/all`;
    } else {
      if (start !== null) {
        const s = url.includes('?') ? "&" : "?";
        url = `${url}${s}start=${start}`;
      }
      if (end !== null) {
        const s = url.includes('?') ? "&" : "?";
        url = `${url}${s}end=${end}`;
      }
    }

    if (i !== null || window.location.pathname.includes('graph') ) {
        const s = url.includes('?') ? "&" : "?";
        url = `${url}${s}i=${i||'true'}`;
    }

    console.log({findmedrew:url});

    const resp = await fetch(url);
    body = await resp.json();

    if (all !== null && index !== null) {
      body = {
        results: body.results[index]
      };
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