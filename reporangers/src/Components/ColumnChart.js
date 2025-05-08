import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const ColumnChart = ({ analysisData }) => {
  const files = Array.isArray(analysisData?.status?.files) ? analysisData.status.files : [];

  const categories = files.map(file => file.file?.split('/').pop() || 'Unknown');


  const locData = files.map(file =>
    typeof file.metric?.loc === 'number' ? file.metric.loc : 0
  );

  const complexityData = files.map(file =>
    typeof file.metric?.code_complexity === 'number' ? file.metric.code_complexity : 0
  );

  const options = {
    chart: { type: 'column' },
    title: { text: 'Lines of Code vs Code Complexity by File' },
    // subtitle: { text: 'Source: Static Analysis' },
    xAxis: {
      categories,
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: { text: 'Metric Value' }
    },
    tooltip: {
      shared: true,
      valueSuffix: ''
    },
    credits: {
      enabled: false
  },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [
      {
        name: 'Lines of Code',
        data: locData
      },
      {
        name: 'Code Complexity',
        data: complexityData
      }
    ]
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default ColumnChart;
