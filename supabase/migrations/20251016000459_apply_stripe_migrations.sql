/*
  # Apply All Stripe Migrations
  
  This migration applies all Stripe-related tables and views that are required
  for the subscription system to work properly.
  
  1. Tables Created:
    - stripe_customers: Links users to Stripe customers
    - stripe_subscriptions: Tracks subscription status
    - stripe_orders: Stores order information
    - stripe_user_subscriptions: User-specific subscription table
    - user_prompt_usage: Tracks AI prompt usage limits
  
  2. Views Created:
    - stripe_user_subscriptions (view): Secure view for subscription data
    - stripe_user_orders (view): Secure view for order data
  
  3. Security:
    - All tables have RLS enabled
    - Policies ensure users can only access their own data
*/

-- Create stripe_customers table if not exists
CREATE TABLE IF NOT EXISTS stripe_customers (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) not null unique,
  customer_id text not null unique,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone default null
);

ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'stripe_customers' AND policyname = 'Users can view their own customer data'
  ) THEN
    CREATE POLICY "Users can view their own customer data"
        ON stripe_customers
        FOR SELECT
        TO authenticated
        USING (user_id = auth.uid() AND deleted_at IS NULL);
  END IF;
END $$;

-- Create subscription status enum if not exists
DO $$ BEGIN
  CREATE TYPE stripe_subscription_status AS ENUM (
      'not_started',
      'incomplete',
      'incomplete_expired',
      'trialing',
      'active',
      'past_due',
      'canceled',
      'unpaid',
      'paused'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create stripe_subscriptions table if not exists
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id bigint primary key generated always as identity,
  customer_id text unique not null,
  subscription_id text default null,
  price_id text default null,
  current_period_start bigint default null,
  current_period_end bigint default null,
  cancel_at_period_end boolean default false,
  payment_method_brand text default null,
  payment_method_last4 text default null,
  status stripe_subscription_status not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone default null
);

ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'stripe_subscriptions' AND policyname = 'Users can view their own subscription data'
  ) THEN
    CREATE POLICY "Users can view their own subscription data"
        ON stripe_subscriptions
        FOR SELECT
        TO authenticated
        USING (
            customer_id IN (
                SELECT customer_id
                FROM stripe_customers
                WHERE user_id = auth.uid() AND deleted_at IS NULL
            )
            AND deleted_at IS NULL
        );
  END IF;
END $$;

-- Create order status enum if not exists
DO $$ BEGIN
  CREATE TYPE stripe_order_status AS ENUM (
      'pending',
      'completed',
      'canceled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create stripe_orders table if not exists
CREATE TABLE IF NOT EXISTS stripe_orders (
    id bigint primary key generated always as identity,
    checkout_session_id text not null,
    payment_intent_id text not null,
    customer_id text not null,
    amount_subtotal bigint not null,
    amount_total bigint not null,
    currency text not null,
    payment_status text not null,
    status stripe_order_status not null default 'pending',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    deleted_at timestamp with time zone default null
);

ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'stripe_orders' AND policyname = 'Users can view their own order data'
  ) THEN
    CREATE POLICY "Users can view their own order data"
        ON stripe_orders
        FOR SELECT
        TO authenticated
        USING (
            customer_id IN (
                SELECT customer_id
                FROM stripe_customers
                WHERE user_id = auth.uid() AND deleted_at IS NULL
            )
            AND deleted_at IS NULL
        );
  END IF;
END $$;

-- Create user_prompt_usage table for AI prompt limits
CREATE TABLE IF NOT EXISTS public.user_prompt_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  daily_prompts_used INTEGER NOT NULL DEFAULT 0,
  monthly_prompts_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE public.user_prompt_usage ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_prompt_usage' AND policyname = 'Users can view their own prompt usage'
  ) THEN
    CREATE POLICY "Users can view their own prompt usage"
      ON public.user_prompt_usage
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_prompt_usage' AND policyname = 'Users can insert their own prompt usage'
  ) THEN
    CREATE POLICY "Users can insert their own prompt usage"
      ON public.user_prompt_usage
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_prompt_usage' AND policyname = 'Users can update their own prompt usage'
  ) THEN
    CREATE POLICY "Users can update their own prompt usage"
      ON public.user_prompt_usage
      FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Create index for prompt usage lookups
CREATE INDEX IF NOT EXISTS idx_user_prompt_usage_user_date 
  ON public.user_prompt_usage(user_id, date);

-- Drop existing view if it exists and recreate it
DROP VIEW IF EXISTS stripe_user_subscriptions;

-- Create view for user subscriptions
CREATE VIEW stripe_user_subscriptions WITH (security_invoker = true) AS
SELECT
    c.customer_id,
    s.subscription_id,
    s.status as subscription_status,
    s.price_id,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at_period_end,
    s.payment_method_brand,
    s.payment_method_last4
FROM stripe_customers c
LEFT JOIN stripe_subscriptions s ON c.customer_id = s.customer_id
WHERE c.user_id = auth.uid()
AND c.deleted_at IS NULL
AND s.deleted_at IS NULL;

GRANT SELECT ON stripe_user_subscriptions TO authenticated;

-- Drop existing view if it exists and recreate it
DROP VIEW IF EXISTS stripe_user_orders;

-- Create view for user orders
CREATE VIEW stripe_user_orders WITH (security_invoker = true) AS
SELECT
    c.customer_id,
    o.id as order_id,
    o.checkout_session_id,
    o.payment_intent_id,
    o.amount_subtotal,
    o.amount_total,
    o.currency,
    o.payment_status,
    o.status as order_status,
    o.created_at as order_date
FROM stripe_customers c
LEFT JOIN stripe_orders o ON c.customer_id = o.customer_id
WHERE c.user_id = auth.uid()
AND c.deleted_at IS NULL
AND o.deleted_at IS NULL;

GRANT SELECT ON stripe_user_orders TO authenticated;