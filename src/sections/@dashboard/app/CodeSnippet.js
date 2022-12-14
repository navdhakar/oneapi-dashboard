import { useState, useEffect } from 'react';
import { CopyBlock, obsidian } from 'react-code-blocks';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Box, Card, CardHeader } from '@mui/material';
// utils
import { fNumber } from '../../../utils/formatNumber';
// components
import { BaseOptionChart } from '../../../components/chart';

// ----------------------------------------------------------------------

CodeSnippet.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
};

export default function CodeSnippet({ title, subheader, link, chartData, ...other }) {
  const [code, setcode] = useState('');

  const DatabaseAPI = `const postData = async (dbURI, data) => {
    const payload = {
      doc:{   // this is where you add your data object which is to be added in collection
        data
      }
    }
    const response = await fetch(dbURI, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(payload),
      cache: 'no-cache',
      credentials: 'same-origin', 
      headers: {
        -'X-Parse-Application-Id': 'Database Name' 
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer', 
    });
    return response.json();
  };
  //returned response
  /*{
    "response": "new collection/doc",
    "collectionName": "userprofile"
}*/
const getData = async (dbURI/CollectionName) => {
    const response = await fetch(dbURI, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        -'X-Parse-Application-Id': 'Database Name' 
      },
    });
    return response.json();
  };
   //returned response
  /*{
  "objectId": "2ntvSpRGIK",
  "createdAt": "2022-01-01T12:23:45.678Z"
}*/
{/*{
  "results": [
    {
      "objectId": "2ntvSpRGIK",
      "userName": my awesome data,
      "userEmail":"My user Email"
      "updatedAt": "2022-01-01T12:23:45.678Z",
      "createdAt": "2022-01-01T12:23:45.678Z"
    }
  ]
}*/}`;

  const PaymentCode = `
  <a href="https://app.nocodepayments.dev/paylinkpayment/<URLToken>" 
  class="ud-main-btn ud-white-btn">
    Purchase Now
  <a>`;

  useEffect(() => {
    console.log(title);
    if (title === 'Database') {
      setcode(DatabaseAPI);
    }
    if (title === 'Payments') {
      setcode(PaymentCode);
    }
  }, [title]);

  const chartLabels = chartData.map((i) => i.label);

  const chartSeries = chartData.map((i) => i.value);

  const chartOptions = merge(BaseOptionChart(), {
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: () => '',
        },
      },
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '28%', borderRadius: 2 },
    },
    xaxis: {
      categories: chartLabels,
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={subheader} subheader={`URLToken: ${link}`} />

      <CopyBlock
        text={code}
        language={'html'}
        showLineNumbers={false}
        startingLineNumber={1}
        theme={obsidian}
        codeBlock
      />
      {/* <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart type="bar" series={[{ data: chartSeries }]} options={chartOptions} height={364} />
      </Box> */}
    </Card>
  );
}
