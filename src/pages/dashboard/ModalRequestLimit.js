import {Fragment, react, useContext, useState} from 'react';
import {
    Box, Button, Card, CardActions, CardContent,
    FormHelperText,
    Grid,
    InputLabel,
    Modal,
    OutlinedInput,
    Stack,
    Typography
} from "@mui/material";
import MainCard from "../../components/MainCard";
import {Formik} from "formik";
import * as Yup from "yup";
import AnimateButton from "../../components/@extended/AnimateButton";
import { db } from '../../FirebaseConfig';
import {collection, addDoc, serverTimestamp, doc, setDoc, updateDoc} from "firebase/firestore";
import UserContext from "../../context/UserContext";



const ModalRequestLimit = ({closeModal}) => {
    const [open, setOpen] = useState(true);
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const { user } = useContext(UserContext);
    const [chosenPlan, setChosenPlan] = useState(false);
    const handleClose = () => {
        setOpen(false);
        closeModal();
    }

    const styleReg = {
        width: 'auto',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxHeight: '50vh',
        overflowY: 'auto'
    }
    const paymentPlans = [
        {
            title: 'Basic',
            price: '$5',
            features: ['50 notes a month'],
        },
        {
            title: 'Pro',
            price: '$15',
            features: ['Unlimited notes'],
        },
        {
            title: 'Enterprise',
            price: '$90',
            features: ['Unlimited notes for all users', 'Unlimited member accounts'],
        },
    ];

    const choosePlanHandler = async (planOption) => {
        const userRef = doc(db, `users/${user.uid}`);
        await updateDoc(userRef, {plan_request: planOption+1});
        setChosenPlan(true);
    }

    const renderPaymentPlans = () => {
        return (
        paymentPlans.map((plan, index) => (
            <Grid item xs={12} sm={4} key={index}>
                <Card style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <CardContent style={{flexGrow: 1}}>
                        <Typography variant="h5" component="div">
                            {plan.title}
                        </Typography>
                        <Typography variant="h4">{plan.price}</Typography>
                        <Typography style={{overflowY: 'auto', maxHeight: '150px'}}>
                            {plan.features.map((feature, index) => (
                                <div key={index}>&bull; {feature}</div>
                            ))}
                        </Typography>
                    </CardContent>
                    <CardActions style={{marginTop: 'auto'}}>
                        <Button size="small" variant="contained" onClick={() => choosePlanHandler(index)}>
                            Choose Plan
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        ))
        );
    };

    const renderEmailSubmission = () => {
        return (
            <>
                <Typography variant={"h6"}>Get notified when more options are available or choose a monthly plan below</Typography>
                <Formik
                    initialValues={{
                        email: '',
                        submit: null
                    }}
                    validationSchema={Yup.object().shape({
                        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    })}
                    onSubmit={async (values, {setErrors, setStatus, setSubmitting}) => {
                        // setStatus({success: false});
                        setSubmitting(false);
                        // Add DB logic here with emails
                        saveEmail(values.email).then(() => {
                            setStatus({success: true});
                            setEmailSubmitted(true);
                        }).catch((error) => {
                            setStatus({success: true});
                        })
                    }
                    }
                >
                    {({errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values}) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="email-signup"></InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            error={Boolean(touched.email && errors.email)}
                                            id="email-login"
                                            type="email"
                                            value={values.email}
                                            name="email"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Enter Email"
                                            inputProps={{}}
                                        />
                                        {touched.email && errors.email && (
                                            <FormHelperText error id="helper-text-email-signup">
                                                {errors.email}
                                            </FormHelperText>
                                        )}
                                    </Stack>
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
                                            // disabled={Boolean(touched.email)}
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                        >
                                            Get Notified!
                                        </Button>
                                    </AnimateButton>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
            </>
        );
    };

    const saveEmail = async (email) => {
        try {
            await addDoc(collection(db, "signup_emails"), {
                email: email,
                timestamp: serverTimestamp()
            })

        } catch (error) {
            console.log('Error saving email:', error);
        }

    };

    return (
        <Fragment>
                <Modal
                    open={open}
                    onClose={handleClose}
                >
                    <MainCard sx={styleReg}>
                        {!chosenPlan &&
                            <Box>
                                {!emailSubmitted &&
                                    <>
                                        <Typography textAlign={"center"} variant={"h4"}> We are excited to see you want more!</Typography>
                                        <Stack alignItems={"center"}>
                                            <Typography textAlign={"center"} variant={"h6"}>At this time we are still in beta and can only provide limited use</Typography>
                                        </Stack>
                                    </>
                                }
                                <Box display={"flex"} justifyContent={"center"}>
                                    <Stack direction={"column"} alignItems={"center"}>
                                        {!emailSubmitted &&
                                            <>
                                            {renderEmailSubmission()}
                                            </>
                                        }
                                        <Typography id="payment-plans-modal-title" variant="h5" component="h2">
                                            Choose a Monthly Payment Plan
                                        </Typography>
                                        <Grid container spacing={2} style={{ marginTop: 16 }}>
                                            {renderPaymentPlans()}
                                        </Grid>
                                    </Stack>
                                </Box>
                            </Box>
                        }
                        {chosenPlan &&
                            <>
                                {emailSubmitted &&
                                    <Stack alignItems={"center"}>
                                        <Typography variant={"h4"}>Thanks for choosing a plan!</Typography>
                                        <Typography variant={"h4"}>We'll notify you when ready!</Typography>
                                        <Button onClick={handleClose} variant="contained" color="primary">Exit</Button>
                                    </Stack>
                                }
                                {!emailSubmitted &&
                                    <Stack alignItems={"center"} spacing={2}>
                                        <Typography variant={"h4"}>Thanks for choosing a plan!</Typography>
                                        <Typography variant={"h4"}>Enter email below to be notified when we are ready!</Typography>
                                        {renderEmailSubmission()}
                                        <Button onClick={handleClose} variant="contained" color="primary">Exit</Button>
                                    </Stack>
                                }
                            </>
                        }
                    </MainCard>
                </Modal>
        </Fragment>
    );
};

export default ModalRequestLimit;