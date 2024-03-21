"use client"

import { useMemo, useState } from "react";

function timeoutPromise(ms){
  return new Promise((resolve, reject)=>{
    setTimeout(resolve,ms);
  }); 
}

let c=0;

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
    // _data = JSON.stringify(_data,null,2);
    // _data = _data.split('\n').join('<br/>');
    // console.log({_data});
    removeColons(_data);
    setData(_data.results);
  },[]);

  let body;
  if(data===null){
    body = (
      <div>loading</div>
    );
  }else{

    (() => {

      function depthDive(data, key) {
        if(typeof data === 'object'){
          Object.keys(data).forEach((c)=>{
            const new_data = depthDive(data[c], key+"."+c);
            // console.log('findmedrew_new',key, new_data);
          });
        }else{
          const s = ['findmedrew',key, data].join(', ');
          console.log(s);
          return s;
        }
      }
    
      depthDive(data, '');
    
    })();

    body = (
      <>
        <table>
          <th>times</th>
          <tr>
            <td>period_start</td>
            <td>{data.times.period_start}</td>
          </tr>
          <tr>
            <td>period_end</td>
            <td>{data.times.period_end}</td>
          </tr>
          <tr>
            <td>earliest_record</td>
            <td>{data.times.earliest_record}</td>
          </tr>
          <tr>
            <td>latest_record</td>
            <td>{data.times.latest_record}</td>
          </tr>
          <tr>
            <td>days_in_range</td>
            <td>{data.times.days_in_range}</td>
          </tr>
          <tr></tr>
          <th>info</th>
          <tr></tr>
          <tr>
            <td>avg_produced</td>
            <td>{data.info.production_info.avg_produced}</td>
          </tr>
          <tr>
            <td>gross_consumption</td>
            <td>{data.info.production_info.gross_consumption}</td>
          </tr>
          <tr>
            <td>gross_usage</td>
            <td>{data.info.production_info.gross_usage}</td>
          </tr>
          <tr>
            <td>total_raw_production</td>
            <td>{data.info.production_info.total_raw_production}</td>
          </tr>
          <tr>
            <td>usage_time</td>
            <td>{data.info.production_info.usage_time}</td>
          </tr>
          <th>bill</th>
          <tr>
            <td>total_consumption</td>
            <td>{data.info.bill.total_consumption}</td>
          </tr>
          <tr>
            <td>total_surplus_generation</td>
            <td>{data.info.bill.total_surplus_generation}</td>
          </tr>
          <tr>
            <td>total_credit_earned</td>
            <td>{data.info.bill.total_credit_earned}</td>
          </tr>
          <tr>
            <td>gross_receipt_tax_reimbursement</td>
            <td>{data.info.bill.gross_receipt_tax_reimbursement}</td>
          </tr>
          <tr>
            <td>pcu_rate</td>
            <td>{data.info.bill.pcu_rate}</td>
          </tr>
          <tr>
            <td>total_energy_charge</td>
            <td>{data.info.bill.total_energy_charge}</td>
          </tr>
          <tr>
            <td>total_oncor_price</td>
            <td>{data.info.bill.total_oncor_price}</td>
          </tr>
          <tr>
            <td>total_ercot_price_rounded</td>
            <td>{data.info.bill.total_ercot_price_rounded}</td>
          </tr>
          <tr>
            <td>total_fee</td>
            <td>{data.info.bill.total_fee}</td>
          </tr>
          <tr>
            <td>total_charge</td>
            <td>{data.info.bill.total_charge}</td>
          </tr>
          <tr>
            <td>avg_earned</td>
            <td>{data.info.bill.avg_earned}</td>
          </tr>
          <th>money</th>
          <tr>
            <td>total_credit_earned</td>
            <td>{data.info.money.total_credit_earned}</td>
          </tr>
          <tr>
            <td>oppo_earned</td>
            <td>{data.info.money.oppo_earned}</td>
          </tr>
          <tr>
            <td>total_earned_toward_solar</td>
            <td>{data.info.money.total_earned_toward_solar}</td>
          </tr>
        </table>
      </>
    );
  }

  return (
    body
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
        // debugger
        delete data[c];
				c = new_c;
      }
      removeColons(data[c]);
    });
  }
  return data;
}
