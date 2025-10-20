export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'subscription' | 'payment';
  price: number;
  currency: string;
  interval?: 'month' | 'year';
}

export const STRIPE_PRODUCTS: StripeProduct[] = [
  {
    id: 'prod_SyDkvgrm9cnJB1',
    priceId: 'price_1S2HIpHw9Rfrc8Pb0TadskWx',
    name: 'ADA Education Personal Plan (Monthly)',
    description: 'Access ADA\'s learning tools with a flat monthly rate. Includes core study features, flashcards, and progress tracking.',
    mode: 'subscription',
    price: 7.99,
    currency: 'usd',
    interval: 'month'
  },
  {
    id: 'prod_SyDkOKHrMmI4iu',
    priceId: 'price_1S2HIlHw9Rfrc8PbamssrqEZ',
    name: 'ADA Education Personal Plan (Yearly)',
    description: 'Save with annual billing. Get a full year of ADA\'s core learning tools, flashcards, and progress tracking at a discounted rate.',
    mode: 'subscription',
    price: 79.99,
    currency: 'usd',
    interval: 'year'
  },
  {
    id: 'prod_SyDki7DezmfksB',
    priceId: 'price_1S37LuHw9Rfrc8PbrwuDrUyJ',
    name: 'ADA Education Personal+ Plan (Monthly)',
    description: 'Unlock everything ADA offers with Personal+. Includes advanced features, extra mini-games, and premium study tools. Billed monthly.',
    mode: 'subscription',
    price: 14.99,
    currency: 'usd',
    interval: 'month'
  },
  {
    id: 'prod_SyDkRngehS843U',
    priceId: 'price_1S37MaHw9Rfrc8Pb1fDD3ywv',
    name: 'ADA Education Personal+ Plan (Yearly)',
    description: 'Best value. Enjoy years of ADA Personal+ premium learning features, advanced tools, and extra mini-games at a reduced annual price.',
    mode: 'subscription',
    price: 149.99,
    currency: 'usd',
    interval: 'year'
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.priceId === priceId);
};

export const getProductsByMode = (mode: 'subscription' | 'payment'): StripeProduct[] => {
  return STRIPE_PRODUCTS.filter(product => product.mode === mode);
};