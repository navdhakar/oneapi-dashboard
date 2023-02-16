import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import CodeEditor from '@uiw/react-textarea-code-editor';
// @mui
import {
  Card,
  CardHeader,
  Box,
  Button,
  Typography,
  Stack,
  TextField,
  TableRow,
  TableBody,
  TableCell,
  Tab,
  Switch,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  FormControl,
} from '@mui/material';
// components
import { BaseOptionChart } from '../../../components/chart';
import MenuPopover from '../../../components/MenuPopover';
import Label from '../../../components/Label';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../user';

import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
import { UNIFY_URI } from '../../../config';
// ----------------------------------------------------------------------
import { makePostRequest } from '../../../Api/Apikit';

ApplicationPanel.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function ApplicationPanel({ title, subheader, chartLabels, chartData, ...other }) {
  const [open, setOpen] = useState(null);
  const [openAddDoc, setopenAddDoc] = useState(null);
  const [addEmailauth, setaddEmailauth] = useState(false);
  const [addsmsauth, setaddsmsauth] = useState(false);
  const [selectedDatabase, setselectedDatabase] = useState(null);
  const [loading, setloading] = useState(false);
  const [endpoint, setendpoint] = useState('');
  // const [APIname, setAPIname] = useState('');
  const [currentAPI, setcurrentAPI] = useState('');
  const [code, setCode] = useState(
    `(function() {\n const Result = null;\n const userInfo = req.userInfo; // access your user's info using this(only available if oauth enabled) \n const DBconn = mongoose.createConnection(req.databaseURI); //access your database using this\n //write your api(js) function here\n //use above variables to modify database and access your user's info\n return Result //assign your api response in Result\n})()`
  );

  const [Eserviceinitialized, setEserviceinitialized] = useState(false);
  const [Sserviceinitialized, setSserviceinitialized] = useState(false);
  const [updatestate, setupdatestate] = useState(false);

  const obj = useSelector((state) => state.authReducer);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };
  const handleAddDocumentsOpen = (event, dburi, db) => {
    setopenAddDoc(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  const handleAddDocumentsClose = () => {
    setopenAddDoc(null);
  };

  const addAPIcontainer = () => {
    setloading(true);

    const data = {
      email: obj.email,
      endpoint: endpoint,
      code: code,
    };
    makePostRequest('/signup/register/add_api', data).then((res) => {
      console.log(res);
      setloading(false);
    });
  };
  const updateAPIcontainer = () => {
    setloading(true);

    const data = {
      email: obj.email,
      endpoint: endpoint,
      code: code,
    };
    makePostRequest('/signup/register/update_api', data).then((res) => {
      console.log(res);
      setloading(false);
    });
  };
  const Loading = () => {
    if (loading === true) {
      return <CircularProgress />;
    }
  };
  const apiendpoint = (event) => {
    setendpoint(event.target.value);
  };
  // const apiname = (event) => {
  //   setAPIname(event.target.value);
  // };
  const handleAPIselect = (event) => {
    setcurrentAPI(event.target.value);
    console.log(currentAPI);
    if (event.target.value === 'new') {
      setendpoint('');

      setCode(
        `(async function() {
 const userInfo = req.userInfo; // access your user's info using this 
 const DBconn = mongoose.createConnection(req.databaseURI); //access your database using this
 const UserInfo = DBconn.model('test1', DefaultSchema); //access any collection
 let Result = await UserInfo.find({})
 console.log(Result)
 //write your api(js) function here
 //use above variables to modify database and access your user's info
 return Result //assign your api response in Result
})()`
      );
    } else {
      const api = obj.customapi.find((o) => o.endpoint === event.target.value);
      if (api.endpoint === 'Add' || api.endpoint === undefined) {
        setupdatestate(false);
      } else {
        setupdatestate(true);
      }
      setendpoint(api.endpoint);
      // setAPIname(api.name);
      setCode(api.code);
    }
  };

  useEffect(() => {
    // setaddEmailauth(true);
    if (obj.userauthinfo) {
      console.log(obj.userauthinfo);
      setselectedDatabase(obj.userauthinfo.DatabaseName);
      setEserviceinitialized(obj.userauthinfo.Status);
      if (obj.userauthinfo.AuthType === 'E-mail') {
        setaddEmailauth(true);
      }
    }
  });

  return (
    <>
      <Card {...other}>
        <CardHeader title={title} subheader={`complete api route:/unify/dyno/apicontainer/${endpoint}/databasename`} />
        <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Select API</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={currentAPI}
              label="Select API"
              onChange={handleAPIselect}
            >
              <MenuItem value={'new'}>Add</MenuItem>
              {obj.customapi.map((api) => {
                return <MenuItem value={api.endpoint}>{api.endpoint}</MenuItem>;
              })}
            </Select>
          </FormControl>

          {/* <TextField label="API Name" fullWidth style={{ margin: 10 }} onChange={(e) => apiname(e)} value={APIname} /> */}
          <TextField
            label="API endpoint"
            fullWidth
            style={{ margin: 10 }}
            onChange={(e) => apiendpoint(e)}
            value={endpoint}
          />
          {updatestate ? (
            <Button
              variant="contained"
              onClick={() => {
                updateAPIcontainer();
              }}
              style={{ margin: 10 }}
            >
              Update
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                addAPIcontainer();
              }}
              style={{ margin: 10 }}
            >
              Save
            </Button>
          )}
          <Loading />
        </div>
        <CodeEditor
          value={code}
          language="js"
          placeholder="Please enter JS code."
          onChange={(evn) => setCode(evn.target.value)}
          padding={15}
          style={{
            fontSize: 16,

            fontFamily: '"Fira code", "Fira Mono", monospace',
          }}
        />
      </Card>
    </>
  );
}
