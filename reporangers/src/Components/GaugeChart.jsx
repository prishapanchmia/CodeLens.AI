import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import 'highcharts/highcharts-more';
import 'highcharts/modules/solid-gauge';

export default function GaugeChart({metric}) {
  const options = {
    chart: {
      type: 'solidgauge',
      backgroundColor: 'transparent',
      height: '100%',
    },
    title: { text: 'Visualization', style: { color: '#fff', fontSize: '1.5em' } },
    pane: {
      startAngle: -90,
      endAngle: 270,
      background: [
        { outerRadius: '112%', innerRadius: '100%', backgroundColor: '#333', borderWidth: 0 },
        { outerRadius: '99%',  innerRadius: '87%',  backgroundColor: '#333', borderWidth: 0 },
        { outerRadius: '86%',  innerRadius: '74%',  backgroundColor: '#333', borderWidth: 0 },
        { outerRadius: '73%',  innerRadius: '61%',  backgroundColor: '#333', borderWidth: 0 },
        { outerRadius: '60%',  innerRadius: '48%',  backgroundColor: '#333', borderWidth: 0 },
        { outerRadius: '47%',  innerRadius: '35%',  backgroundColor: '#333', borderWidth: 0 },
      ]
    },
    yAxis: {
      min: 0,
      max: 100,
      lineWidth: 0,
      tickPositions: []
    },
    plotOptions: {
      solidgauge: {
        dataLabels: { enabled: false },
        linecap: 'round'
      }
    },
    legend: {
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical',
      itemStyle: { color: '#fff', fontWeight: 'bold' },
      symbolRadius: 0,
      symbolHeight: 8,
      symbolWidth: 16,
      itemMarginBottom: 8
    },
    credits: { enabled: false },
    // tooltip: { enabled: true },
    tooltip:{
      backgroundColor: 'none',
        fixed: true,
        pointFormat:
            '<span style="font-size: 1em; color: {point.color}; font-weight: bold;">{series.name}:{point.y}</span>',
        position: {
            align: 'center',
            verticalAlign: 'middle'
        },
        style: {
            fontSize: '16px',
        },
        valueSuffix: '%'
    },
    series: [
      {
        name: 'Code Complexity',
        data: [{ y: metric.code_complexity*10, color: '#4FA2FF', radius: '112%', innerRadius: '100%' }]
      },
      {
        name: 'Code Coverage',
        data: [{ y: metric.code_coverage*10, color: '#2D6BFF', radius: '99%',  innerRadius: '87%'  }]
      },
      {
        name: 'Code Duplication',
        data: [{ y: metric.code_duplication*10, color: '#9F79FF', radius: '86%',  innerRadius: '74%'  }]
      },
      {
        name: 'Code Smells',
        data: [{ y: metric.code_smells*10, color: '#4F79FF', radius: '73%',  innerRadius: '61%'  }]
      },
      {
        name: 'Linting & Style',
        data: [{ y: metric.linting_and_style_compliance*10, color: '#00AAFF', radius: '60%',  innerRadius: '48%'  }]
      },
      {
        name: 'Vulnerabilities',
        data: [{ y: metric.vulnerabilities*10, color: '#0088FF', radius: '47%',  innerRadius: '35%'  }]
      },
    ]
  };

  return (
    <div style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
};
