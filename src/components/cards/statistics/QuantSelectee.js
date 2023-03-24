import PropTypes from 'prop-types';

// material-ui
import {Avatar, Box, Button, Card, Chip, Grid, Stack, Typography} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import {alpha, styled, useTheme} from '@mui/material/styles';

// assets
import Iconify from '../../../components/iconify';
import theme from "../../../themes/theme";
import {Fragment} from "react";
import {isFunctionLikeExpression} from "eslint-plugin-react/lib/util/ast";

import { getAuth } from 'firebase/auth'


import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from '../../../FirebaseConfig';
// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //

const TOTALBOTS = "Total Bots:";

const StyledIcon = styled('div')(({theme}) => ({
    margin: 'auto',
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    width: theme.spacing(8),
    height: theme.spacing(8),
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
}));

const QuantSelectee = ({title, icon, sx, color = '', quantName, totalBots, loaded, subscribed}) => {
    const user = getAuth().currentUser;

    const subscribeHandler = async ({quantName}) => {

        const docRef = `users/${user.uid}/`;
        try
        {
            await updateDoc(doc(db, docRef), {
                quant_subscriptions: arrayUnion(`${quantName}`)
            });
        } catch (error) {
            console.log("ERROR ADDING SUBSCRIPTION", error);
        }
    }


    return (
        <MainCard
            sx={{
                py: 0,
                boxShadow: 0,
                textAlign: 'center',
                bgcolor: color !== '' ? (theme) => theme.palette[color].lighter : '#ffffff',
                minHeight: 190
            }}
        >
            {!loaded &&
                <Typography variant={"h4"}>Loading...</Typography>
            }
            {loaded &&
                <Fragment>
                    <Grid container sx={{
                        flexWrap: 'no-wrap',
                        display: 'flex',
                    }}>
                        <Grid xs={12} item container justifyContent={'space-between'}>
                            <Grid item xs={12}>
                                <Typography variant="h3">{quantName}</Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Avatar alt={quantName} src={icon} sx={{margin: "auto", width: 60, height: 60}}></Avatar>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h3">{totalBots}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction={"row"} justifyContent={'center'} alignItems={'center'}>
                                <Typography variant="subtitle2" sx={{opacity: 0.72}}>
                                    {title}
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Fragment>
            }
        </MainCard>
    );
}

QuantSelectee.propTypes = {
    color: PropTypes.string,
    quantName: PropTypes.string,
    totalBots: PropTypes.string,
    percentage: PropTypes.number,
    isLoss: PropTypes.bool,
    extra: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
};

QuantSelectee.defaultProps = {
    color: 'primary'
};

export default QuantSelectee;
