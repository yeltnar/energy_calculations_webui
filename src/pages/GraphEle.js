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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
        borderColor:'rgba(175,200,175)',
        backgroundColor:'rgba(175,200,175)',
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
        }
    },
  };
  
  return <Line options={options} height={null} width={null} data={new_data} />;
}
