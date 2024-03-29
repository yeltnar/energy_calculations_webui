"use client"

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
// import faker from 'faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export async function wrapper(){
    const data = await getData();
    return <AppTest/>;
}

export function AppTest(){
    console.log({findmedrew:'AppTest'});
    return <div>final</div>
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

  const new_labels = data.results.individual_data.map((cur)=>{
    return cur.usage_time;
  });

  const raw_production_dataset = {
    label: 'raw_production',
    data: data.results.individual_data.map((cur)=>{
        return cur.raw_production;
    }),
    borderColor: 'rgb(99, 255, 132)',
    backgroundColor: 'rgba(255, 99, 132, 0.5)',
  };

  const surplus_generation_dataset = {
    label: 'surplus_generation',
    data: data.results.individual_data.map((cur)=>{
        return cur.surplus_generation;
    }),
    borderColor: 'rgb(255, 99, 132)',
    backgroundColor: 'rgba(255, 99, 132, 0.5)',
  };

  const consumption_dataset = {
    label: 'consumption',
    data: data.results.individual_data.map((cur)=>{
        return cur.consumption;
    }),
    borderColor: 'rgb(255, 99, 255)',
    backgroundColor: 'rgba(255, 99, 132, 0.5)',
  };

  const earned_dataset = {
    label: 'earned',
    data: data.results.individual_data.map((cur)=>{
        return cur.earned;
    }),
    borderColor: 'rgb(0, 255, 132)',
    backgroundColor: 'rgba(0, 255, 132, 0.5)',
  };

  const spend_dataset = {
    label: 'spend',
    data: data.results.individual_data.map((cur)=>{
        return cur.spend;
    }),
    borderColor: 'rgb(255, 99, 132)',
    backgroundColor: 'rgba(255, 99, 132, 0.5)',
  };

  const datasets = [
    {
        name:'raw_production',
        borderColor:'rgba(0,255,0)',
        backgroundColor:'rgba(0,255,0)',
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
    // {
    //     name:'earned',
    //     borderColor:'rgba(0,0,0)',
    //     backgroundColor:'rgba(0,0,0)',
    // },
    // {
    //     name:'spend',
    //     borderColor:'rgba(0,0,0)',
    //     backgroundColor:'rgba(0,0,0)',
    // },
  ].map((cur_dataset)=>{
    return {
        label: cur_dataset.name,
        data: data.results.individual_data.map((cur)=>{
            return cur[cur_dataset.name];
        }),
        borderColor: cur_dataset.borderColor,
        backgroundColor: cur_dataset.borderColor,
      };
  });

  const new_data = {
    labels: new_labels,
    datasets
  };

  console.log(new_data);

  const options = {
    responsive: true,
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
        }
    },
  };
  
  return <Line options={options} data={new_data} />;
}
