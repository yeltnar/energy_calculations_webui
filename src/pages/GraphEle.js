"use client"

import Decimal from 'decimal.js';
import React, {useState, useMemo} from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import getData, {getDataNow} from '@/getData';
import getQueryParemeters from '../getQueryParameters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// function to average over time windows.. started with hourly 
function getSimpleResults({individual_data, minutes=false, hours=false, avg=true}){
  const obj = {};

  individual_data.forEach((cur)=>{
    const fixed_date = new Date(cur.ms);
    if(minutes===true){
      fixed_date.setMinutes(0)
    }
    if(hours===true){
      fixed_date.setHours(0)
    }
    const new_ms = fixed_date.setSeconds(0)
    
    obj[new_ms] = obj[new_ms] === undefined ? [] : obj[new_ms];
    obj[new_ms].push(cur);
    
  });

  for( let k in obj ){
    let keys = Object.keys(obj[k][0]);
    let length = obj[k].length;

    keys.forEach(( key )=>{
      obj[k].forEach((cur)=>{

        if( typeof cur[key] !== 'number' ){
          obj[k][key] =obj[k][key]===undefined ? cur[key] : obj[k][key];
          return;
        }

        // default to 0
        obj[k][key] = obj[k][key]===undefined ? new Decimal(0) : obj[k][key];

        // sum all the values 
        // obj[k][key] += cur[key];
        obj[k][key] = obj[k][key].add(cur[key]);

      });
    });

    // clean up ; conert Decimal to number ; average out 
    for (let l in obj[k]) {
      // throw obj[k].length;
      if (Decimal.isDecimal(obj[k][l])) {
        if (avg === true) {
          // throw obj[k].length;
          const len = obj[k].length;
          obj[k][l] = obj[k][l].dividedBy(len)
        }
        obj[k][l] = obj[k][l].toNumber();
      }
    }

  }

  const to_return = [];
  for( let k in obj ){
    to_return.push(obj[k]);
  }
  
  console.log({"ffmd":obj});
  // throw new Error('no thanks');

  return to_return;
}

export default function App() {

  const data = getDataNow();

  console.log({
        findmedrew:'fmd',
      data,        
  })

  if(data===null || data===undefined){
    return null;
  }

  let ignore_minutes = false;
  let ignore_hours = false;
  const {grain:grainularity} = getQueryParemeters();
  
  if(grainularity === 'day'){
    ignore_minutes = true;
    ignore_hours = true;
  }
  if(grainularity === 'hour'){
    ignore_minutes = true;
  }

  // if we ask for it to be false, set to false, but true otherwise 
  let {avg} = getQueryParemeters();
  avg = avg === 'false';

  const get_obj = { 
    individual_data: data.results.individual_data, 
    minutes: ignore_minutes, 
    hours: ignore_hours,
    avg,
  };
  data.results.individual_data = getSimpleResults(get_obj);

  const new_labels = data.results.individual_data.map((cur)=>{
    return cur.usage_time;
  });

  const datasets = [
    {
        name:'raw_production',
        borderColor:'rgba(0,255,0)',
        backgroundColor:'rgba(0,255,0)',
    },
    {
        name:'raw_power_production',
        borderColor:'rgba(200,200,0)',
        backgroundColor:'rgba(200,200,0)',
        hidden: true,
    },
    {
        name:'surplus_generation',
        borderColor:'rgba(150,150,0)',
        backgroundColor:'rgba(150,150,0)',
    },
    {
        name:'consumption',
        borderColor:'rgba(255,30,30)',
        backgroundColor:'rgba(255,30,30)',
    },
    {
        name:'total_usage',
        borderColor:'rgba(255,150,150)',
        backgroundColor:'rgba(255,150,150)',
    },
    {
        name:'earned',
        borderColor:'rgba(200,200,175)',
        backgroundColor:'rgba(200,200,175)',
        hidden: true,
    },
    {
        name:'solar_reimbursement',
        borderColor:'rgba(175,200,175)',
        backgroundColor:'rgba(175,200,175)',
        hidden: true,
    },
    {
        name:'saved',
        borderColor:'rgba(175,175,200)',
        backgroundColor:'rgba(175,175,200)',
        hidden: true,
    },
    {
        name:'spend',
        borderColor:'rgba(200,175,175)',
        backgroundColor:'rgba(200,175,175)',
        hidden: true,
    },
    {
        name:'gross_usage',
        borderColor:'rgba(200,175,175)',
        backgroundColor:'rgba(200,175,175)',
        hidden: true,
    },
    {
        name:'price',
        borderColor:'rgba(200,175,175)',
        backgroundColor:'rgba(200,175,175)',
        hidden: true,
    },
    {
        name:'price_uncapped',
        borderColor:'rgba(0,0,0)',
        backgroundColor:'rgba(0,0,0)',
        hidden: true,
    },
  ].map((cur_dataset)=>{
    return {
        label: cur_dataset.name,
        data: data.results.individual_data.map((cur)=>{
            return cur[cur_dataset.name];
        }),
        borderColor: cur_dataset.borderColor,
        backgroundColor: cur_dataset.borderColor,
        hidden: cur_dataset.hidden ? cur_dataset.hidden : false,
      };
  });

  const new_data = {
    labels: new_labels,
    datasets
  };

  console.log(new_data);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
    scales: {
        x: {
            display: false
        }, 
        y: {
          grid: {
            lineWidth: ({ tick }) => tick.value == 0 ? 3 : 1
          }
        }
    },
  };
  
  return <Line options={options} height={null} width={null} data={new_data} />;
}
