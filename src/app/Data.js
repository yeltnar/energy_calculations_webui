"use client"

import { useMemo, useState } from "react";

const number_str_map = ['zero','one','two','three', 'four'];

function timeoutPromise(ms){
  return new Promise((resolve, reject)=>{
    setTimeout(resolve,ms);
  }); 
}

const getData = (()=>{

  let body;
  let pending = (async function(){
    console.log('[getData] findmedrew');

    // let url = `http://localhost:3000`;
    let url = `https://energy-calculations.mini.lan`;
    let start = new URLSearchParams(window.location.search).get("start");
    let end = new URLSearchParams(window.location.search).get("end");
    
    if( start !== null ){
        const s = url.includes('?') ? "&" : "?";
        url = `${url}${s}start=${start}`;
    }
    if( end !== null ){
        const s = url.includes('?') ? "&" : "?";
        url = `${url}${s}end=${end}`;
    }

    const resp = await fetch(url);
    body = await resp.json();
    return body;
  })();

  return async function getData(){
    console.log('getData findmedrew');
    return await pending;
  }

})();

export default function Data() {
  const [data, setData] = useState(null);
  useMemo(async()=>{
    if(data!==null){return;}
    let _data = await getData();
    removeColons(_data);
    setData(_data.results);
  },[]);

  let body;
  if(data===null){
    body = (
      <div>loading</div>
    );
  }else{

    body = (() => {
      return (<DepthDive data={data} cur={'data'} parent_arr={['data']}></DepthDive>);
    })();
  }

  return (
    body
  );
}

function DepthDive({data, cur, parent_arr}) {

  const [collapsed, setCollapsed] = useState(false);

  function clickCallBack(...a){
    console.log(...a);
    setCollapsed(!collapsed);
  }

  const bonus_class = number_str_map[parent_arr.length]
  const collapsed_class = collapsed ? 'collapsed' : undefined;
  const className = [...parent_arr, bonus_class].join(' ');
  let content;

  if(typeof data === 'object'){

    let children = [];

    Object.keys(data).forEach((c)=>{
      const new_data = (<DepthDive collapsed={collapsed} data={data[c]} cur={c} parent_arr={[...parent_arr, c]}></DepthDive>);
      children.push(new_data);
    });

    content = (
      <div>
        <div className="aaa" onClick={clickCallBack}>{cur}</div>
        <div className={collapsed_class}>{children}</div>
      </div>
    );

  }else{
    content = (<div className="deep">{cur} - {data}</div>)
  }

  return (
    <div className={className}>
      {content}
    </div>
  );
}

function removeColons(data){

  if( typeof data === 'object' ){
    Object.keys(data).forEach((c)=>{
      let test_arr = c.split(': ');
      if(test_arr.length>1){
        let new_c = test_arr[1];
        data[new_c] = data[c];
        console.log(c);
        console.log(new_c);
        delete data[c];
				c = new_c;
      }
      removeColons(data[c]);
    });
  }
  return data;
}
