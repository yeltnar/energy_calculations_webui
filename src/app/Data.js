"use client"

import { useMemo, useState } from "react";
import getData from '../getData';

const number_str_map = ['zero','one','two','three', 'four', 'five'];

function timeoutPromise(ms){
  return new Promise((resolve, reject)=>{
    setTimeout(resolve,ms);
  }); 
}

export default function Data() {
  const [data, setData] = useState(null);
  useMemo(async()=>{
    if(data!==null){return;}
    let _data = await getData();
    // removeColons(_data);
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

  if(typeof data === 'object' && data !== null){

    let children = [];

    Object.keys(data).forEach((c, index)=>{
      const new_data = (<DepthDive key={index} collapsed={collapsed} data={data[c]} cur={c} parent_arr={[...parent_arr, c]}></DepthDive>);
      children.push(new_data);
    });

    content = (
      <div>
        <div className="aaa" onClick={clickCallBack}>{cur}</div>
        <div className={collapsed_class}>{children}</div>
      </div>
    );

  }else{
    data = data===null ? 'null' : data ;
    content = (<div className="deep">{cur}: {data}</div>)
  }

  return (
    <div className={className}>
      {content}
    </div>
  );
}

function removeColons(data){

  if( typeof data === 'object' && data !== null ){
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
