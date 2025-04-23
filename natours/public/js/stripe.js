/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_51RH0Gw3AQZyCdgYubqNv31NjW7Df3FFHajnnNI8ywLDep2gj9Fzaw0EEYCpbZR96Sxc62S8tcYpXAGmKA7VTvMzI00AsLBbAX2');

export const bookTour = async tourId => {
    
    try{
        const session = await axios(
            `/api/v1/bookings/checkout-session/${tourId}`
        );

        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch(err){
        showAlert('error', err);
    }
};