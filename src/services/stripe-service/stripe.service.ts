// import { loadStripe, Stripe } from '@stripe/stripe-js';

class StripePromise {
  // private stripeInstance: Promise<Stripe | null>;
  // constructor() {
  //   this.stripeInstance = loadStripe(
  //     process.env.VITE_APP_STRIPE_PUBLIC_KEY || '',
  //   );
  // }
  // public get(): Promise<Stripe | null> {
  //   return this.stripeInstance;
  // }
}

export const stripePromise = new StripePromise();
