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

    const styleNonReg = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    }

    const styleReg = {
        width: '75%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    }
    const paymentPlans = [
        {
            title: 'Basic',
            price: '$5',
            features: ['50 Summaries a month'],
        },
        {
            title: 'Pro',
            price: '$15',
            features: ['Unlimited Summaries'],
        },
        {
            title: 'Enterprise',
            price: '$90',
            features: ['Unlimited summaries for all users', 'Unlimited member accounts'],
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
            {user.email === "" &&
                <Modal
                    open={open}
                    onClose={handleClose}
                >
                    <MainCard sx={styleNonReg}>
                        <Box display={"flex"} justifyContent={"center"}>
                            <Stack direction={"column"} alignItems={"center"}>
                                {!emailSubmitted &&
                                    <>
                                        <Typography variant={"h4"}>Currently we are in beta and can only provide 5 summaries.</Typography>
                                        <Typography variant={"h4"}>Get notified when unlimited access is available!</Typography>
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
                                }
                                {emailSubmitted &&
                                    <Stack alignItems={"center"}>
                                        <Typography variant={"h4"}>Thanks for signing up!</Typography>
                                        <Typography variant={"h4"}>We'll notify you when ready!</Typography>
                                    </Stack>
                                }
                            </Stack>
                        </Box>
                    </MainCard>
                </Modal>
            }
            {user.email !== "" &&
                <Modal
                    open={open}
                    onClose={handleClose}
                    >
                    <MainCard sx={styleReg}>
                        <Typography textAlign={"center"} variant={"h4"}>Unfortunately we can only provide 5 free summaries</Typography>
                        <Typography id="payment-plans-modal-title" variant="h5" component="h2">
                            Choose a Monthly Payment Plan
                        </Typography>
                        <Grid container spacing={2} style={{ marginTop: 16 }}>
                            {renderPaymentPlans()}
                        </Grid>
                        {chosenPlan &&
                            <Stack alignItems={"center"}>
                                <Typography textAlign={"center"} variant={"h4"}>We are excited to see you want more!</Typography>
                                <Typography textAlign={"center"} variant={"h4"}>At this time we are still in beta, we will email you by mid May</Typography>
                            </Stack>
                        }
                    </MainCard>
                </Modal>
            }

        </Fragment>

    )
};

export default ModalRequestLimit;