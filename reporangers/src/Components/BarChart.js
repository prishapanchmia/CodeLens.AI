import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const BarChart = ({ analysisData }) => {
  const files = Array.isArray(analysisData?.status?.files) ? analysisData.status.files : [];

  const categories = files.map(file => file.file?.split('/').pop() || 'Unknown');

  const locData = files.map(file =>
    typeof file.metric?.loc === 'number' ? file.metric.loc : 0
  );

  const complexityData = files.map(file =>
    typeof file.metric?.code_complexity === 'number' ? file.metric.code_complexity : 0
  );

  const vulnerabilitiesData = files.map(file =>
    typeof file.metric?.vulnerabilities === 'number' ? file.metric.vulnerabilities : 0
  );

  const options = {
    chart: { type: 'bar' },
    title: { text: 'Code Metrics by File' },
    // subtitle: { text: 'Source: Static Analysis' },
    xAxis: {
      categories,
      title: { text: null },
      gridLineWidth: 1,
      lineWidth: 0
    },
    yAxis: {
      min: 0,
      title: { text: 'Metric Value', align: 'high' },
      labels: { overflow: 'justify' },
      gridLineWidth: 0
    },
    tooltip: { valueSuffix: ' units' },
    plotOptions: {
      bar: {
        borderRadius: '50%',
        dataLabels: { enabled: true },
        groupPadding: 0.1
      }
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      x: -40,
      y: 80,
      floating: true,
      borderWidth: 1,
      backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
      shadow: true
    },
    credits: {
      enabled: false
  },
    series: [
      {
        name: 'Lines of Code',
        data: locData
      },
      {
        name: 'Code Complexity',
        data: complexityData
      },
      {
        name: 'Vulnerabilities',
        data: vulnerabilitiesData
      }
    ]
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default BarChart;
