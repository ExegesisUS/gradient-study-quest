export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  mode: 'subscription' | 'payment';
}

export const STRIPE_PRODUCTS: StripeProduct[] = [
  {
    priceId: 'price_1SIevcHw9Rfrc8Pb6ZhYBByT',
    name: 'ADA Education Personal Plan (Yearly)',
    description: 'Save with annual billing. Get a full year of ADA\'s core learning tools, flashcards, and progress tracking at a discounted rate.',
    price: 59.99,
    currency: 'usd',
    mode: 'subscription'
  },
  {
    priceId: 'price_1SIev3Hw9Rfrc8Pby8tJWGfe',
    name: 'ADA Education Personal Plan (Monthly)',
    description: 'Access ADA\'s learning tools with a flat monthly rate. Includes core study features, flashcards, and progress tracking.',
    price: 5.99,
    currency: 'usd',
    mode: 'subscription'
  },
  {
    priceId: 'price_1SIeuDHw9Rfrc8PbHCQgeuJ2',
    name: 'ADA Education Personal+ Plan (Yearly)',
    description: 'Best value. Enjoy years of ADA Personal+ premium learning features, advanced tools, and extra mini-games at a reduced annual price.',
    price: 99.99,
    currency: 'usd',
    mode: 'subscription'
  },
  {
    priceId: 'price_1S37LuHw9Rfrc8PbrwuDrUyJ',
    name: 'ADA Education Personal+ Plan (Monthly)',
    description: 'Unlock everything ADA offers with Personal+. Includes advanced features, extra mini-games, and premium study tools. Billed monthly.',
    price: 9.99,
    currency: 'usd',
    mode: 'subscription'
  }
];