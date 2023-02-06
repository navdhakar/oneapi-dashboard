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

export default function CodeSnippet({ title, subheader, link, ...other }) {
  const [code, setcode] = useState('');

  const PostData = `const postData = async ('APIendpoint/postdata/databasename/collectionname') => {
    const payload = {
      authtoken:"token", //if using OAuth in your app
      doc:{   // this is where you add your data object      
        data // which is to be added in collection
      }
    }
    const response = await fetch(dbURI, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers:{
        authorization:"your secret token"
      }
    });
    return response.json();
  };
  //returned response
  /*{
    "response": "new collection/doc",
    "collectionName": "userprofile"
}*/`;
  const GetData = `const getData = async ('APIendpoint/operation/databasename/collectionname') => {
    //here operation can be find, findOne, findById, 
    //findOneAndUpdate, updateMany, deleteMany, deleteOne
    //findByOneAndDelete, replaceOne, updateOne.
    const payload = {
      authtoken:"token", //if using OAuth in your app
      query:{            
      email:"someone@gmail.com" //standard mongoose query
      }
      update:{
        name:"some name" // update query also need update data
      }                 // only pass this for update and replace queries
    }
    const response = await fetch(dbURI, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers:{
        authorization:"your secret token"
      }
    });
    return response.json();
  };
   //returned response
  /*{
   Queried documents
}*/`;

  const PaymentCode =
    `
  <a href="` +
    `${link}" ` +
    `class="ud-main-btn ud-white-btn">
    Purchase Now
  <a>`;

  useEffect(() => {
    console.log(title);
    if (title === 'Post Data') {
      setcode(PostData);
    }
    if (title === 'Get Data') {
      setcode(GetData);
    }

    if (title === 'Payments') {
      setcode(PaymentCode);
    }
  }, [title]);

  // const chartLabels = chartData.map((i) => i.label);

  // const chartSeries = chartData.map((i) => i.value);

  // const chartOptions = merge(BaseOptionChart(), {
  //   tooltip: {
  //     marker: { show: false },
  //     y: {
  //       formatter: (seriesName) => fNumber(seriesName),
  //       title: {
  //         formatter: () => '',
  //       },
  //     },
  //   },
  //   plotOptions: {
  //     bar: { horizontal: true, barHeight: '28%', borderRadius: 2 },
  //   },
  //   xaxis: {
  //     categories: chartLabels,
  //   },
  // });

  return (
    <Card {...other}>
      <CardHeader title={subheader} />

      <CopyBlock
        text={code}
        language={'javascript'}
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
