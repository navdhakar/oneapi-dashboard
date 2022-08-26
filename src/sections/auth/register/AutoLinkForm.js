import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { UNIFY_URI } from '../../../config';
import { makePostRequest } from '../../../Api/Apikit';

// ----------------------------------------------------------------------

export default function AutoLinkForm() {
  const navigate = useNavigate();
  const [Email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [Verification, setVerification] = useState(false);
  const [OTP, setOTP] = useState('');
  const [Name, setName] = useState('');
  const [Accountno, setAccountno] = useState(0);
  const [Secret, setSecret] = useState('');
  const [IFSC, setIFSC] = useState('');
  const [Verified, setVerified] = useState(false);
  const [Trigger, setTrigger] = useState('Email');
  const [Triggerdata, setTriggerdata] = useState('');
  const [alert, setalert] = useState(false);
  const [alerttext, setalerttext] = useState('');
  const [loading, setloading] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name required'),
    lastName: Yup.string().required('Last Name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    setloading(true);
    const data = {
      email: Email,
    };
    makePostRequest('/unify/paymentservices/verifyemail', data)
      .then((res) => {
        console.log(res);
        setloading(false);
        setVerification(true);
      })
      .catch((err) => {
        console.log(err);
        setalerttext('email verify did not succeed, try again');
        setalert(true);
      });
  };
  const onCreate = async () => {
    setloading(true);
    console.log(Email);
    const data = {
      otp: OTP,
      name: Name,
      email: Email,
      accountno: Accountno,
      ifsc: IFSC,
      secret: Secret,
      verified: false,
      trigger: 'Email',
      triggerdata: Triggerdata,
    };
    makePostRequest('/unify/paymentservices/enable', data)
      .then((res) => {
        console.log(res);
        const maildata = {
          email: Email,
          paylink: `https://oneapi.vercel.app/paylinkpayment/${res.urlToken}`,
          name: Name,
        };
        makePostRequest('/Payments/InitPayments/sendlinkmail', maildata).then((resp) => {
          setloading(false);
          navigate(`/paylinkpayment/${res.urlToken}`);
        });
      })
      .catch((err) => {
        console.log(err);
        setalerttext('Payments enable failed');
        setalert(true);
      });
  };
  const handleOTP = (event) => {
    setOTP(event.target.value);
  };
  const handleaccount = (event) => {
    setAccountno(event.target.value);
  };
  const handlesecret = (event) => {
    setSecret(event.target.value);
  };
  const handleName = (event) => {
    setName(event.target.value);
  };
  const handleifsc = (event) => {
    setIFSC(event.target.value);
  };
  const handletriggerdata = (event) => {
    setTriggerdata(event.target.value);
  };
  const Loading = () => {
    if (loading === true) {
      return <CircularProgress sx={{ color: '#118C4F' }} />;
    }
  };
  return (
    <Stack spacing={3}>
      <TextField
        Name="email"
        label="Email address"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />

      {Verification ? null : (
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          sx={{ backgroundColor: '#00d36b' }}
          loading={isSubmitting}
          onClick={() => {
            onSubmit();
          }}
        >
          {loading ? <Loading /> : 'Register'}
        </LoadingButton>
      )}
      {Verification ? (
        <>
          <TextField Name="otp" label="OTP" type={'number'} onChange={handleOTP} />
          <TextField Name="account no" label="Account Number" type={'number'} onChange={handleaccount} />
          <TextField Name="name" label="Account Holder Name" onChange={handleName} />

          <TextField Name="IFSC code" label="IFSC Code" onChange={handleifsc} />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Trigger</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={'Email'} label="Trigger">
              <MenuItem value={'Email'}>Email</MenuItem>
              <MenuItem value={'SMS'}>SMS</MenuItem>
            </Select>
          </FormControl>
          <TextField Name="trigger data" label="Email text recieved by sender" onChange={handletriggerdata} />

          <TextField Name="Secret" label="Secret" onChange={handlesecret} />
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              onCreate();
            }}
            sx={{ backgroundColor: '#00d36b' }}
            style={{ margin: 10 }}
          >
            {loading ? <Loading /> : 'Create'}
          </Button>
        </>
      ) : null}
      {alert ? (
        <Alert severity="error" sty>
          <span style={{ fontFamily: 'Roboto Mono, monospace' }}>{alerttext}</span>
        </Alert>
      ) : null}
    </Stack>
  );
}
