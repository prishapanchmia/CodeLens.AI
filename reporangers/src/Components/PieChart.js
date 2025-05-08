import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const PieChart = ({ analysisData }) => {
  console.log("PieChart analysisData", analysisData);
  const files = Array.isArray(analysisData?.status?.files) ? analysisData.status.files : [];

  const baseColors = Highcharts.getOptions().colors;

  const data = files.map((file, index) => {
    const baseColor = baseColors[index % baseColors.length];

    return {
      name: file.file?.split('/').pop() || 'Unknown',
      y: typeof file.metric?.code_complexity === 'number' ? file.metric.code_complexity : 0,
      color: {
        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
        stops: [
          [0, baseColor],
          [1, Highcharts.color(baseColor).brighten(-0.3).get('rgb')]
        ]
      }
    };
  });

  const options = {
    chart: { type: 'pie' },
    title: { text: 'Code Complexity Distribution by File' },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
      point: { valueSuffix: '%' }
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        size: '80%',
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format:
            '<span style="font-size: 1.2em"><b>{point.name}</b></span><br>' +
            '<span style="opacity: 0.6">{point.percentage:.1f} %</span>',
          connectorColor: 'rgba(128,128,128,0.5)'
        }
      }
    },
    series: [
      {
        name: 'Complexity',
        data
      }
    ]
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default PieChart;
