import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, TextField, Button } from '@mui/material';
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
  const [Verified, setVerified] = useState(false);
  const [Trigger, setTrigger] = useState('Email');
  const [Triggerdata, setTriggerdata] = useState('');

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
    const data = {
      email: Email,
    };
    makePostRequest('/unify/paymentservices/verifyemail', data)
      .then((res) => {
        console.log(res);
        setVerification(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onCreate = async () => {
    console.log(Email);
    const data = {
      otp: OTP,
      name: Name,
      email: Email,
      accountno: Accountno,
      secret: Secret,
      verified: false,
      trigger: 'Email',
      triggerdata: Email,
    };
    makePostRequest('/unify/paymentservices/enable', data)
      .then((res) => {
        console.log(res);
        navigate(`/autolinkpayment/${res.urlToken}`);
      })
      .catch((err) => {
        console.log(err);
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
          sx={{ backgroundColor: '#118C4F' }}
          loading={isSubmitting}
          onClick={() => {
            onSubmit();
          }}
        >
          Register
        </LoadingButton>
      )}
      {Verification ? (
        <>
          <TextField Name="otp" label="OTP" type={'number'} onChange={handleOTP} />
          <TextField Name="name" label="Name" onChange={handleName} />

          <TextField Name="account no" label="Account Number" type={'number'} onChange={handleaccount} />
          <TextField Name="Secret" label="Secret" onChange={handlesecret} />
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              onCreate();
            }}
            style={{ margin: 10 }}
          >
            Create
          </Button>
        </>
      ) : null}
    </Stack>
  );
}
