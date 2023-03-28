import {useEffect, useState} from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';

// material-ui
import {
    Box,
    Button,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    Link,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import {Formik} from 'formik';

// project import
import FirebaseSocial from './FirebaseSocial';
import AnimateButton from 'components/@extended/AnimateButton';
import {strengthColor, strengthIndicator} from 'utils/password-strength';

// assets
import {EyeOutlined, EyeInvisibleOutlined} from '@ant-design/icons';

// firebase auth
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {initializeApp} from "firebase/app";
import {doc, setDoc} from "firebase/firestore";
import {db, auth} from "../../../FirebaseConfig";

// ============================|| FIREBASE - REGISTER ||============================ //

const AuthRegister = () => {
    const navigate = useNavigate();
    const [level, setLevel] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [isRegeristering, setIsRegistering] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('');
    }, []);

    return (
        <>
            <Formik
                initialValues={{
                    displayname: '',
                    email: '',
                    company: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    displayname: Yup.string().max(255).required('First Name is required'),
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={async (values, {setErrors, setStatus, setSubmitting}) => {
                    setStatus({success: false});
                    setSubmitting(false);

                    createUserWithEmailAndPassword(auth, values.email, values.password)
                        .then((userCredential) => {
                            const user = userCredential.user;
                            updateProfile(user, {
                                displayName: values.displayname, photoURL: ''
                            }).then(() => {
                                setIsRegistering(true);
                                setDoc(doc(db,`users/${user.uid}`), {quant_subscriptions: []})
                                    .then(() => {
                                        navigate('/dashboard/default');
                                    })
                            })
                        })
                        .catch((error) => {
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            console.error(errorCode);
                            console.error(errorMessage);
                            setStatus({success: false});
                            setErrors({submit: error.message});
                            setSubmitting(false);
                            setIsRegistering(false);
                        })

                }
                }
            >
                {({errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values}) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="displayname-signup">Display Name*</InputLabel>
                                    <OutlinedInput
                                        id="displayname-login"
                                        type="displayname"
                                        value={values.displayname}
                                        name="displayname"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="John"
                                        fullWidth
                                        error={Boolean(touched.displayname && errors.displayname)}
                                    />
                                    {touched.displayname && errors.displayname && (
                                        <FormHelperText error id="helper-text-displayname-signup">
                                            {errors.displayname}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.email && errors.email)}
                                        id="email-login"
                                        type="email"
                                        value={values.email}
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="demo@company.com"
                                        inputProps={{}}
                                    />
                                    {touched.email && errors.email && (
                                        <FormHelperText error id="helper-text-email-signup">
                                            {errors.email}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="password-signup">Password</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.password && errors.password)}
                                        id="password-signup"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            handleChange(e);
                                            changePassword(e.target.value);
                                        }}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    size="large"
                                                >
                                                    {showPassword ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        placeholder="******"
                                        inputProps={{}}
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText error id="helper-text-password-signup">
                                            {errors.password}
                                        </FormHelperText>
                                    )}
                                </Stack>
                                <FormControl fullWidth sx={{mt: 2}}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Box sx={{
                                                bgcolor: level?.color,
                                                width: 85,
                                                height: 8,
                                                borderRadius: '7px'
                                            }}/>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                {level?.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2">
                                    By Signing up, you agree to our &nbsp;
                                    <Link variant="subtitle2" component={RouterLink} to="#">
                                        Terms of Service
                                    </Link>
                                    &nbsp; and &nbsp;
                                    <Link variant="subtitle2" component={RouterLink} to="#">
                                        Privacy Policy
                                    </Link>
                                </Typography>
                            </Grid>
                            {errors.submit && (
                                <Grid item xs={12}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        disabled={isRegeristering || Boolean(!touched.email)}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        {isRegeristering ? 'Creating Account' : 'Create Account'}
                                    </Button>
                                </AnimateButton>
                            </Grid>
                            {/* TODO after email auth is handled */}
                            {/*<Grid item xs={12}>*/}
                            {/*    <Divider>*/}
                            {/*        <Typography variant="caption">Sign up with</Typography>*/}
                            {/*    </Divider>*/}
                            {/*</Grid>*/}
                            {/*<Grid item xs={12}>*/}
                            {/*    <FirebaseSocial />*/}
                            {/*</Grid>*/}
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AuthRegister;
