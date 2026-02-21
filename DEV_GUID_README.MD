# Auth Usage Guide - Best Practices

## 🎯 Architecture Overview

Auth is fetched **once** in the root route and available everywhere through context. This is the most efficient and secure approach.

```
Root Route (__root.tsx)
    ↓ beforeLoad fetches session
    ↓ passes to context.auth
    ↓
All Child Routes
    ↓ access via context.auth
    ↓ use middleware for protection
```

## ✅ Best Practices

### 1. **Root Route** (Already Set Up)

The session is fetched once in `__root.tsx`:

```typescript
// src/routes/__root.tsx
export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    const session = await getSession();
    return {
      auth: session, // ← Available globally
    };
  },
  // ...
});
```

### 2. **Protected Routes** - Use Middleware

```typescript
// src/routes/(library)/route.tsx
export const Route = createFileRoute("/(library)")({
  component: LibraryLayout,
  server: {
    middleware: [authMiddleware], // ← Protects entire route tree
  },
});
```

### 3. **Access Auth in Loaders**

```typescript
export const Route = createFileRoute("/dashboard")({
  loader: async ({ context }) => {
    // Access auth from context
    const userId = context.auth?.user?.id;

    if (!userId) {
      throw redirect({ to: "/login" });
    }

    const data = await fetchUserData(userId);
    return { data };
  },
});
```

### 4. **Access Auth in Components**

```typescript
import { useRouter } from "@tanstack/react-router";

function MyComponent() {
    const router = useRouter();
    const session = router.options.context?.auth;

    if (!session) {
        return <Navigate to="/login" />;
    }

    return <div>Hello {session.user.name}</div>;
}
```

### 5. **Multiple Middleware Combo**

```typescript
export const Route = createFileRoute("/admin/dashboard")({
  server: {
    middleware: [
      authMiddleware, // Requires login
      adminMiddleware, // Requires admin role
    ],
  },
});
```

## 🛡️ Available Middleware

### Basic Auth

```typescript
import { authMiddleware } from "@/middleware/auth";

server: {
    middleware: [authMiddleware], // Just requires login
}
```

### Admin Only

```typescript
import { adminMiddleware } from "@/middleware/auth";

server: {
    middleware: [adminMiddleware], // Requires admin role
}
```

### Subscription Required

```typescript
import { proMiddleware, premiumMiddleware } from "@/middleware/auth";

// PRO or PREMIUM
server: {
    middleware: [proMiddleware],
}

// Only PREMIUM
server: {
    middleware: [premiumMiddleware],
}
```

### Email Verification Required

```typescript
import { verifiedEmailMiddleware } from "@/middleware/auth";

server: {
    middleware: [verifiedEmailMiddleware],
}
```

### Combined Requirements

```typescript
import { require } from "@/middleware/auth";

server: {
    middleware: [
        require({
            verified: true,
            role: "admin",
            subscription: "PREMIUM",
        })
    ],
}
```

### Custom Permission

```typescript
import { requirePermission } from "@/middleware/auth";

server: {
    middleware: [
        requirePermission("posts", "delete"),
    ],
}
```

## ❌ Don't Do This

### ❌ Fetching Session Again in Routes

```typescript
// WRONG - Session already in context!
export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const session = await getSession(); // ← Redundant!
    return { auth: session };
  },
});
```

### ❌ Fetching in Every Component

```typescript
// WRONG - Use context instead
function MyComponent() {
  const session = await getSession(); // ← Can't even do this client-side!
}
```

## 🔐 API Routes (Exception)

API route handlers need to fetch session directly since they don't have route context:

```typescript
export const Route = createFileRoute("/api/data")({
  server: {
    handlers: {
      GET: async (request) => {
        // OK to fetch here - no route context available
        const session = await getSession();

        if (!session) {
          return new Response("Unauthorized", { status: 401 });
        }

        // ... handle request
      },
    },
  },
});
```

## 📊 Performance Benefits

By fetching auth once in the root:

✅ **1 database query** instead of N queries  
✅ **Automatic caching** through context  
✅ **Type safety** throughout the app  
✅ **SSR friendly** - no hydration mismatches  
✅ **Secure** - server-side validation

## 🚀 Summary

1. **Fetch once** in `__root.tsx` ✓ (already done)
2. **Use middleware** to protect routes
3. **Access via `context.auth`** in loaders
4. **Access via `router.options.context.auth`** in components
5. **Never refetch** in child routes (unless API handler)

# Polar API Integration Guide

Complete production-ready API for managing Polar subscriptions, products, and payments.

## 📋 Table of Contents

- [Overview](#overview)
- [Available Endpoints](#available-endpoints)
- [Usage Examples](#usage-examples)
- [Type Safety](#type-safety)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## 🎯 Overview

The Polar API integration provides a complete set of ORPC endpoints for:

- **Products**: List and retrieve product information
- **Subscriptions**: Manage user subscriptions (list, get, cancel, update)
- **Customers**: Get customer details and statistics
- **Checkouts**: Create checkout sessions
- **Utilities**: Sync subscription status, webhook stats

All endpoints are:

- ✅ **Type-safe** with Zod schemas
- ✅ **Authenticated** using `withAuth` middleware
- ✅ **Production-ready** with proper error handling
- ✅ **Secure** with ownership verification

## 📡 Available Endpoints

### Products

#### `polar.listProducts`

List all available products with pagination.

**Input:**

```typescript
{
  limit?: number;  // 1-100, default: 20
  page?: number;   // default: 1
}
```

**Output:**

```typescript
{
  products: Array<{
    id: string;
    name: string;
    description: string | null;
    priceAmount: number;
    priceCurrency: string;
    recurringInterval: "month" | "year" | null;
    isRecurring: boolean;
  }>;
  total: number;
  page: number;
  limit: number;
}
```

#### `polar.getProduct`

Get a specific product by ID.

**Input:**

```typescript
{
  productId: string;
}
```

**Output:** Single product object (same as above)

---

### Subscriptions

#### `polar.listSubscriptions`

List all subscriptions for the authenticated user.

**Input:**

```typescript
{
  limit?: number;        // 1-100, default: 20
  page?: number;         // default: 1
  status?: "incomplete" | "incomplete_expired" | "trialing" | "active" | "past_due" | "canceled" | "unpaid";
  productId?: string;
}
```

**Output:**

```typescript
{
  subscriptions: Array<{
    id: string;
    status: string;
    productName: string;
    amount: number;
    currency: string;
    interval: string | null;
    currentPeriodStart: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  }>;
  total: number;
  page: number;
  limit: number;
}
```

#### `polar.getSubscription`

Get a specific subscription by ID.

**Input:**

```typescript
{
  subscriptionId: string;
}
```

**Output:** Single subscription object

#### `polar.cancelSubscription`

Cancel a user's subscription.

**Input:**

```typescript
{
  subscriptionId: string;
  immediately?: boolean;  // default: false
}
```

**Output:**

```typescript
{
  success: boolean;
  message: string;
  canceledAt?: string;
}
```

#### `polar.updateSubscription`

Update subscription (change plan or toggle auto-renewal).

**Input:**

```typescript
{
  subscriptionId: string;
  productPriceId?: string;        // Change to this plan
  cancelAtPeriodEnd?: boolean;    // Toggle auto-renewal
}
```

**Output:**

```typescript
{
  success: boolean;
  message: string;
}
```

---

### Customer

#### `polar.getCustomer`

Get customer information for the authenticated user.

**Input:** None (uses authenticated user's customer ID)

**Output:**

```typescript
{
  id: string;
  email: string;
  name: string | null;
  subscriptionCount: number;
  totalSpent: number;
} | null
```

---

### Checkout

#### `polar.createCheckout`

Create a checkout session for purchasing a product.

**Input:**

```typescript
{
  productPriceId: string;
  successUrl?: string;
  customerEmail?: string;
}
```

**Output:**

```typescript
{
  id: string;
  url: string; // Redirect user here
  customerId: string | null;
  productId: string;
  productPriceId: string;
  amount: number | null;
  currency: string | null;
  status: string;
}
```

---

### Utilities

#### `polar.syncSubscriptionStatus`

Manually sync a user's subscription status from Polar.

**Input:**

```typescript
{
  userId: string;
}
```

**Output:**

```typescript
{
  success: boolean;
  message: string;
  updatedStatus?: string;
}
```

#### `polar.getWebhookStats`

Get webhook processing statistics (admin only).

**Input:**

```typescript
{
  limit?: number;  // 1-50, default: 10
}
```

**Output:**

```typescript
{
  totalProcessed: number;
  recentEvents: Array<{
    type: string;
    timestamp: string;
    processed: boolean;
  }>;
}
```

---

## 💻 Usage Examples

### Client-Side with ORPC Client

```typescript
import { orpc } from "@/orpc/client";

// List products
const products = await client.polar.listProducts({
  limit: 10,
  page: 1,
});

// Get specific product
const product = await client.polar.getProduct({
  productId: "prod_123",
});

// Create checkout
const checkout = await client.polar.createCheckout({
  productPriceId: "price_123",
  successUrl: "https://myapp.com/success",
});

// Redirect user to checkout
window.location.href = checkout.url;

// List user's subscriptions
const subs = await client.polar.listSubscriptions({
  limit: 20,
  status: "active",
});

// Cancel subscription
const result = await client.polar.cancelSubscription({
  subscriptionId: "sub_123",
  immediately: false,
});

// Update subscription (downgrade/upgrade)
await client.polar.updateSubscription({
  subscriptionId: "sub_123",
  productPriceId: "price_new_plan",
});

// Get customer info
const customer = await client.polar.getCustomer();
if (customer) {
  console.log(`Total spent: $${customer.totalSpent}`);
}
```

### Server-Side in Route Loaders

```typescript
// src/routes/pricing.tsx
export const Route = createFileRoute("/pricing")({
  loader: async () => {
    const products = await client.polar.listProducts({
      limit: 100,
    });

    return { products };
  },
  component: PricingPage,
});

function PricingPage() {
  const { products } = Route.useLoaderData();

  return (
    <div>
      {products.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### React Query Hook

```typescript
// src/hooks/usePolarSubscriptions.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/orpc/client";

export function usePolarSubscriptions() {
  return useQuery({
    queryKey: ["polar", "subscriptions"],
    queryFn: () => client.polar.listSubscriptions({ limit: 20 }),
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId: string) =>
      client.polar.cancelSubscription({ subscriptionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polar", "subscriptions"] });
    },
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: (productPriceId: string) =>
      client.polar.createCheckout({ productPriceId }),
    onSuccess: (data) => {
      // Redirect to checkout
      window.location.href = data.url;
    },
  });
}
```

### Component Usage with Hooks

```typescript
import { usePolarSubscriptions, useCancelSubscription } from "@/hooks/usePolarSubscriptions";

function SubscriptionsPage() {
  const { data, isLoading } = usePolarSubscriptions();
  const cancelMutation = useCancelSubscription();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.subscriptions.map((sub) => (
        <div key={sub.id}>
          <h3>{sub.productName}</h3>
          <p>${sub.amount / 100} / {sub.interval}</p>
          <button
            onClick={() => cancelMutation.mutate(sub.id)}
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? "Canceling..." : "Cancel"}
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔒 Type Safety

All endpoints use Zod schemas for validation:

```typescript
import type {
  ProductResponse,
  SubscriptionResponse,
  CustomerResponse,
  CheckoutResponse,
} from "@/orpc/models/polar";

// Type-safe response handling
const products: ProductResponse[] = await client.polar.listProducts();
const subscription: SubscriptionResponse = await client.polar.getSubscription({
  subscriptionId: "sub_123",
});
```

---

## ⚠️ Error Handling

All endpoints use standardized ORPC errors:

```typescript
try {
  await client.polar.cancelSubscription({ subscriptionId: "sub_123" });
} catch (error) {
  if (error.code === "FORBIDDEN") {
    console.error("Access denied");
  } else if (error.code === "NOT_FOUND") {
    console.error("Subscription not found");
  } else if (error.code === "INTERNAL_ERROR") {
    console.error("Server error");
  }
}
```

Available error codes:

- `UNAUTHENTICATED` - User not logged in
- `FORBIDDEN` - User doesn't own the resource
- `NOT_FOUND` - Resource doesn't exist
- `INTERNAL_ERROR` - Server/Polar API error

---

## 🚀 Best Practices

### 1. Cache Subscription Data

```typescript
// Use React Query for automatic caching
const { data } = useQuery({
  queryKey: ["subscriptions"],
  queryFn: () => client.polar.listSubscriptions({ limit: 20 }),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### 2. Verify Ownership

All subscription/customer endpoints automatically verify that the authenticated user owns the resource.

### 3. Handle Checkout Redirects

```typescript
const handlePurchase = async (priceId: string) => {
  try {
    const checkout = await client.polar.createCheckout({
      productPriceId: priceId,
      successUrl: `${window.location.origin}/success?checkout_id={CHECKOUT_ID}`,
    });

    // Redirect to Polar checkout
    window.location.href = checkout.url;
  } catch (error) {
    toast.error("Failed to create checkout");
  }
};
```

### 4. Sync Subscription Status

For manual reconciliation after webhook issues:

```typescript
// Admin action
await client.polar.syncSubscriptionStatus({
  userId: "user_123",
});
```

### 5. Display Subscription Status

```typescript
function SubscriptionBadge({ subscription }) {
  const statusColors = {
    active: "green",
    trialing: "blue",
    canceled: "red",
    past_due: "yellow",
  };

  return (
    <Badge color={statusColors[subscription.status]}>
      {subscription.status}
    </Badge>
  );
}
```

---

## 🔄 Testing

```typescript
// Mock in tests
vi.mock("@/orpc/client", () => ({
  client: {
    polar: {
      listProducts: vi.fn().mockResolvedValue({
        products: [
          {
            id: "prod_1",
            name: "Premium Monthly",
            priceAmount: 999,
            priceCurrency: "USD",
          },
        ],
        total: 1,
      }),
    },
  },
}));
```

---

## 📊 Monitoring

Track key metrics:

- Checkout creation success rate
- Subscription cancellation rate
- Failed payment recovery
- Customer lifetime value

Use `polar.getWebhookStats` for webhook monitoring.

---

## 🆘 Support

Common issues:

**"Customer not found"**

- User hasn't made a purchase yet
- `customerId` is null in database

**"Subscription not found"**

- Invalid subscription ID
- User trying to access another user's subscription

**"Failed to create checkout"**

- Invalid product price ID
- Polar API credentials issue
- Network error

Check Polar dashboard and server logs for details.

# Auth Usage Guide - Best Practices

## 🎯 Architecture Overview

Auth is fetched **once** in the root route and available everywhere through context. This is the most efficient and secure approach.

```
Root Route (__root.tsx)
    ↓ beforeLoad fetches session
    ↓ passes to context.auth
    ↓
All Child Routes
    ↓ access via context.auth
    ↓ use middleware for protection
```

## ✅ Best Practices

### 1. **Root Route** (Already Set Up)

The session is fetched once in `__root.tsx`:

```typescript
// src/routes/__root.tsx
export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    const session = await getSession();
    return {
      auth: session, // ← Available globally
    };
  },
  // ...
});
```

### 2. **Protected Routes** - Use Middleware

```typescript
// src/routes/(library)/route.tsx
export const Route = createFileRoute("/(library)")({
  component: LibraryLayout,
  server: {
    middleware: [authMiddleware], // ← Protects entire route tree
  },
});
```

### 3. **Access Auth in Loaders**

```typescript
export const Route = createFileRoute("/dashboard")({
  loader: async ({ context }) => {
    // Access auth from context
    const userId = context.auth?.user?.id;

    if (!userId) {
      throw redirect({ to: "/login" });
    }

    const data = await fetchUserData(userId);
    return { data };
  },
});
```

### 4. **Access Auth in Components**

```typescript
import { useRouter } from "@tanstack/react-router";

function MyComponent() {
    const router = useRouter();
    const session = router.options.context?.auth;

    if (!session) {
        return <Navigate to="/login" />;
    }

    return <div>Hello {session.user.name}</div>;
}
```

### 5. **Multiple Middleware Combo**

```typescript
export const Route = createFileRoute("/admin/dashboard")({
  server: {
    middleware: [
      authMiddleware, // Requires login
      adminMiddleware, // Requires admin role
    ],
  },
});
```

## 🛡️ Available Middleware

### Basic Auth

```typescript
import { authMiddleware } from "@/middleware/auth";

server: {
    middleware: [authMiddleware], // Just requires login
}
```

### Admin Only

```typescript
import { adminMiddleware } from "@/middleware/auth";

server: {
    middleware: [adminMiddleware], // Requires admin role
}
```

### Subscription Required

```typescript
import { proMiddleware, premiumMiddleware } from "@/middleware/auth";

// PRO or PREMIUM
server: {
    middleware: [proMiddleware],
}

// Only PREMIUM
server: {
    middleware: [premiumMiddleware],
}
```

### Email Verification Required

```typescript
import { verifiedEmailMiddleware } from "@/middleware/auth";

server: {
    middleware: [verifiedEmailMiddleware],
}
```

### Combined Requirements

```typescript
import { require } from "@/middleware/auth";

server: {
    middleware: [
        require({
            verified: true,
            role: "admin",
            subscription: "PREMIUM",
        })
    ],
}
```

### Custom Permission

```typescript
import { requirePermission } from "@/middleware/auth";

server: {
    middleware: [
        requirePermission("posts", "delete"),
    ],
}
```

## ❌ Don't Do This

### ❌ Fetching Session Again in Routes

```typescript
// WRONG - Session already in context!
export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const session = await getSession(); // ← Redundant!
    return { auth: session };
  },
});
```

### ❌ Fetching in Every Component

```typescript
// WRONG - Use context instead
function MyComponent() {
  const session = await getSession(); // ← Can't even do this client-side!
}
```

## 🔐 API Routes (Exception)

API route handlers need to fetch session directly since they don't have route context:

```typescript
export const Route = createFileRoute("/api/data")({
  server: {
    handlers: {
      GET: async (request) => {
        // OK to fetch here - no route context available
        const session = await getSession();

        if (!session) {
          return new Response("Unauthorized", { status: 401 });
        }

        // ... handle request
      },
    },
  },
});
```

## 📊 Performance Benefits

By fetching auth once in the root:

✅ **1 database query** instead of N queries  
✅ **Automatic caching** through context  
✅ **Type safety** throughout the app  
✅ **SSR friendly** - no hydration mismatches  
✅ **Secure** - server-side validation

## 🚀 Summary

1. **Fetch once** in `__root.tsx` ✓ (already done)
2. **Use middleware** to protect routes
3. **Access via `context.auth`** in loaders
4. **Access via `router.options.context.auth`** in components
5. **Never refetch** in child routes (unless API handler)

# Polar API Integration Guide

Complete production-ready API for managing Polar subscriptions, products, and payments.

## 📋 Table of Contents

- [Overview](#overview)
- [Available Endpoints](#available-endpoints)
- [Usage Examples](#usage-examples)
- [Type Safety](#type-safety)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## 🎯 Overview

The Polar API integration provides a complete set of ORPC endpoints for:

- **Products**: List and retrieve product information
- **Subscriptions**: Manage user subscriptions (list, get, cancel, update)
- **Customers**: Get customer details and statistics
- **Checkouts**: Create checkout sessions
- **Utilities**: Sync subscription status, webhook stats

All endpoints are:

- ✅ **Type-safe** with Zod schemas
- ✅ **Authenticated** using `withAuth` middleware
- ✅ **Production-ready** with proper error handling
- ✅ **Secure** with ownership verification

## 📡 Available Endpoints

### Products

#### `polar.listProducts`

List all available products with pagination.

**Input:**

```typescript
{
  limit?: number;  // 1-100, default: 20
  page?: number;   // default: 1
}
```

**Output:**

```typescript
{
  products: Array<{
    id: string;
    name: string;
    description: string | null;
    priceAmount: number;
    priceCurrency: string;
    recurringInterval: "month" | "year" | null;
    isRecurring: boolean;
  }>;
  total: number;
  page: number;
  limit: number;
}
```

#### `polar.getProduct`

Get a specific product by ID.

**Input:**

```typescript
{
  productId: string;
}
```

**Output:** Single product object (same as above)

---

### Subscriptions

#### `polar.listSubscriptions`

List all subscriptions for the authenticated user.

**Input:**

```typescript
{
  limit?: number;        // 1-100, default: 20
  page?: number;         // default: 1
  status?: "incomplete" | "incomplete_expired" | "trialing" | "active" | "past_due" | "canceled" | "unpaid";
  productId?: string;
}
```

**Output:**

```typescript
{
  subscriptions: Array<{
    id: string;
    status: string;
    productName: string;
    amount: number;
    currency: string;
    interval: string | null;
    currentPeriodStart: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  }>;
  total: number;
  page: number;
  limit: number;
}
```

#### `polar.getSubscription`

Get a specific subscription by ID.

**Input:**

```typescript
{
  subscriptionId: string;
}
```

**Output:** Single subscription object

#### `polar.cancelSubscription`

Cancel a user's subscription.

**Input:**

```typescript
{
  subscriptionId: string;
  immediately?: boolean;  // default: false
}
```

**Output:**

```typescript
{
  success: boolean;
  message: string;
  canceledAt?: string;
}
```

#### `polar.updateSubscription`

Update subscription (change plan or toggle auto-renewal).

**Input:**

```typescript
{
  subscriptionId: string;
  productPriceId?: string;        // Change to this plan
  cancelAtPeriodEnd?: boolean;    // Toggle auto-renewal
}
```

**Output:**

```typescript
{
  success: boolean;
  message: string;
}
```

---

### Customer

#### `polar.getCustomer`

Get customer information for the authenticated user.

**Input:** None (uses authenticated user's customer ID)

**Output:**

```typescript
{
  id: string;
  email: string;
  name: string | null;
  subscriptionCount: number;
  totalSpent: number;
} | null
```

---

### Checkout

#### `polar.createCheckout`

Create a checkout session for purchasing a product.

**Input:**

```typescript
{
  productPriceId: string;
  successUrl?: string;
  customerEmail?: string;
}
```

**Output:**

```typescript
{
  id: string;
  url: string; // Redirect user here
  customerId: string | null;
  productId: string;
  productPriceId: string;
  amount: number | null;
  currency: string | null;
  status: string;
}
```

---

### Utilities

#### `polar.syncSubscriptionStatus`

Manually sync a user's subscription status from Polar.

**Input:**

```typescript
{
  userId: string;
}
```

**Output:**

```typescript
{
  success: boolean;
  message: string;
  updatedStatus?: string;
}
```

#### `polar.getWebhookStats`

Get webhook processing statistics (admin only).

**Input:**

```typescript
{
  limit?: number;  // 1-50, default: 10
}
```

**Output:**

```typescript
{
  totalProcessed: number;
  recentEvents: Array<{
    type: string;
    timestamp: string;
    processed: boolean;
  }>;
}
```

---

## 💻 Usage Examples

### Client-Side with ORPC Client

```typescript
import { orpc } from "@/orpc/client";

// List products
const products = await client.polar.listProducts({
  limit: 10,
  page: 1,
});

// Get specific product
const product = await client.polar.getProduct({
  productId: "prod_123",
});

// Create checkout
const checkout = await client.polar.createCheckout({
  productPriceId: "price_123",
  successUrl: "https://myapp.com/success",
});

// Redirect user to checkout
window.location.href = checkout.url;

// List user's subscriptions
const subs = await client.polar.listSubscriptions({
  limit: 20,
  status: "active",
});

// Cancel subscription
const result = await client.polar.cancelSubscription({
  subscriptionId: "sub_123",
  immediately: false,
});

// Update subscription (downgrade/upgrade)
await client.polar.updateSubscription({
  subscriptionId: "sub_123",
  productPriceId: "price_new_plan",
});

// Get customer info
const customer = await client.polar.getCustomer();
if (customer) {
  console.log(`Total spent: $${customer.totalSpent}`);
}
```

### Server-Side in Route Loaders

```typescript
// src/routes/pricing.tsx
export const Route = createFileRoute("/pricing")({
  loader: async () => {
    const products = await client.polar.listProducts({
      limit: 100,
    });

    return { products };
  },
  component: PricingPage,
});

function PricingPage() {
  const { products } = Route.useLoaderData();

  return (
    <div>
      {products.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### React Query Hook

```typescript
// src/hooks/usePolarSubscriptions.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/orpc/client";

export function usePolarSubscriptions() {
  return useQuery({
    queryKey: ["polar", "subscriptions"],
    queryFn: () => client.polar.listSubscriptions({ limit: 20 }),
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId: string) =>
      client.polar.cancelSubscription({ subscriptionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polar", "subscriptions"] });
    },
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: (productPriceId: string) =>
      client.polar.createCheckout({ productPriceId }),
    onSuccess: (data) => {
      // Redirect to checkout
      window.location.href = data.url;
    },
  });
}
```

### Component Usage with Hooks

```typescript
import { usePolarSubscriptions, useCancelSubscription } from "@/hooks/usePolarSubscriptions";

function SubscriptionsPage() {
  const { data, isLoading } = usePolarSubscriptions();
  const cancelMutation = useCancelSubscription();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.subscriptions.map((sub) => (
        <div key={sub.id}>
          <h3>{sub.productName}</h3>
          <p>${sub.amount / 100} / {sub.interval}</p>
          <button
            onClick={() => cancelMutation.mutate(sub.id)}
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? "Canceling..." : "Cancel"}
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔒 Type Safety

All endpoints use Zod schemas for validation:

```typescript
import type {
  ProductResponse,
  SubscriptionResponse,
  CustomerResponse,
  CheckoutResponse,
} from "@/orpc/models/polar";

// Type-safe response handling
const products: ProductResponse[] = await client.polar.listProducts();
const subscription: SubscriptionResponse = await client.polar.getSubscription({
  subscriptionId: "sub_123",
});
```

---

## ⚠️ Error Handling

All endpoints use standardized ORPC errors:

```typescript
try {
  await client.polar.cancelSubscription({ subscriptionId: "sub_123" });
} catch (error) {
  if (error.code === "FORBIDDEN") {
    console.error("Access denied");
  } else if (error.code === "NOT_FOUND") {
    console.error("Subscription not found");
  } else if (error.code === "INTERNAL_ERROR") {
    console.error("Server error");
  }
}
```

Available error codes:

- `UNAUTHENTICATED` - User not logged in
- `FORBIDDEN` - User doesn't own the resource
- `NOT_FOUND` - Resource doesn't exist
- `INTERNAL_ERROR` - Server/Polar API error

---

## 🚀 Best Practices

### 1. Cache Subscription Data

```typescript
// Use React Query for automatic caching
const { data } = useQuery({
  queryKey: ["subscriptions"],
  queryFn: () => client.polar.listSubscriptions({ limit: 20 }),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### 2. Verify Ownership

All subscription/customer endpoints automatically verify that the authenticated user owns the resource.

### 3. Handle Checkout Redirects

```typescript
const handlePurchase = async (priceId: string) => {
  try {
    const checkout = await client.polar.createCheckout({
      productPriceId: priceId,
      successUrl: `${window.location.origin}/success?checkout_id={CHECKOUT_ID}`,
    });

    // Redirect to Polar checkout
    window.location.href = checkout.url;
  } catch (error) {
    toast.error("Failed to create checkout");
  }
};
```

### 4. Sync Subscription Status

For manual reconciliation after webhook issues:

```typescript
// Admin action
await client.polar.syncSubscriptionStatus({
  userId: "user_123",
});
```

### 5. Display Subscription Status

```typescript
function SubscriptionBadge({ subscription }) {
  const statusColors = {
    active: "green",
    trialing: "blue",
    canceled: "red",
    past_due: "yellow",
  };

  return (
    <Badge color={statusColors[subscription.status]}>
      {subscription.status}
    </Badge>
  );
}
```

---

## 🔄 Testing

```typescript
// Mock in tests
vi.mock("@/orpc/client", () => ({
  client: {
    polar: {
      listProducts: vi.fn().mockResolvedValue({
        products: [
          {
            id: "prod_1",
            name: "Premium Monthly",
            priceAmount: 999,
            priceCurrency: "USD",
          },
        ],
        total: 1,
      }),
    },
  },
}));
```

---

## 📊 Monitoring

Track key metrics:

- Checkout creation success rate
- Subscription cancellation rate
- Failed payment recovery
- Customer lifetime value

Use `polar.getWebhookStats` for webhook monitoring.

---

## 🆘 Support

Common issues:

**"Customer not found"**

- User hasn't made a purchase yet
- `customerId` is null in database

**"Subscription not found"**

- Invalid subscription ID
- User trying to access another user's subscription

**"Failed to create checkout"**

- Invalid product price ID
- Polar API credentials issue
- Network error

Check Polar dashboard and server logs for details.

# TanStack Start Data Fetching Patterns

## 📚 Best Practices for Data Fetching in TanStack Start

### ✅ Pattern 1: `ensureQueryData` + `useSuspenseQuery` (RECOMMENDED)

**When:** Most common case - fetch data and use it in component

```tsx
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/movies/")({
  loader: async ({ context }) => {
    // Fetches ONLY if not already cached
    await context.queryClient.ensureQueryData(
      orpc.media.list.queryOptions({
        input: { status: ["PUBLISHED"] },
      }),
    );
  },
});

function RouteComponent() {
  // Suspends until data ready - data is NEVER undefined
  const { data } = useSuspenseQuery(
    orpc.media.list.queryOptions({
      input: { status: ["PUBLISHED"] },
    }),
  );

  // ✅ TypeScript knows data is defined!
  return <MovieList movies={data.data.items} />;
}
```

**Benefits:**

- ✅ Data guaranteed to exist (no null checks)
- ✅ Automatic loading states via Suspense
- ✅ Avoids re-fetching if cached
- ✅ TypeScript knows data is defined

---

### ✅ Pattern 2: Return data from loader + `useLoaderData`

**When:** Need data in multiple places, or want to pass to non-query components

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/movies/")({
  loader: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData(
      orpc.media.list.queryOptions({
        input: { status: ["PUBLISHED"] },
      }),
    );

    // Return data from loader
    return { movies: data };
  },
});

function RouteComponent() {
  // Access loader data directly
  const { movies } = Route.useLoaderData();

  // Can still use the query if needed
  const { data, refetch } = useSuspenseQuery(
    orpc.media.list.queryOptions({
      input: { status: ["PUBLISHED"] },
    }),
  );

  return <MovieList movies={movies.data.items} onRefresh={refetch} />;
}
```

**Benefits:**

- ✅ Data available immediately
- ✅ No duplicate queries
- ✅ Can pass to non-React-Query components

---

### ✅ Pattern 3: Dynamic data with `loaderDeps`

**When:** Query depends on URL params or search params

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const moviesSearchSchema = z.object({
  type: z.enum(["MOVIE", "EPISODE", "TRACK"]).optional(),
  search: z.string().optional(),
  page: z.number().default(1),
});

export const Route = createFileRoute("/movies/")({
  validateSearch: moviesSearchSchema,
  // Define dependencies that trigger re-fetching
  loaderDeps: ({ search }) => ({
    type: search.type,
    search: search.search,
    page: search.page,
  }),
  loader: async ({ context, deps }) => {
    await context.queryClient.ensureQueryData(
      orpc.media.list.queryOptions({
        input: {
          status: ["PUBLISHED"],
          type: deps.type,
          search: deps.search,
          page: deps.page,
        },
      }),
    );
  },
});

function RouteComponent() {
  const { type, search, page } = Route.useSearch();

  const { data } = useSuspenseQuery(
    orpc.media.list.queryOptions({
      input: {
        status: ["PUBLISHED"],
        type,
        search,
        page,
      },
    }),
  );

  return <MovieList movies={data.data.items} />;
}
```

**Benefits:**

- ✅ Automatic re-fetch when deps change
- ✅ Works with navigation
- ✅ Deep linking support

---

### ✅ Pattern 4: Mutations with optimistic updates

**When:** Creating, updating, or deleting data

```tsx
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

function RouteComponent() {
  const { data } = useSuspenseQuery(
    orpc.media.list.queryOptions({
      input: { status: ["PUBLISHED"] },
    }),
  );

  const createMovie = useMutation({
    mutationFn: (input: CreateMediaInput) =>
      orpc.media.create.mutate({ input }),

    // Optimistic update
    onMutate: async (newMovie) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: orpc.media.list.getQueryKey(),
      });

      // Snapshot previous value
      const previousMovies = queryClient.getQueryData(
        orpc.media.list.getQueryKey(),
      );

      // Optimistically update
      queryClient.setQueryData(orpc.media.list.getQueryKey(), (old) => ({
        ...old,
        data: {
          ...old.data,
          items: [...old.data.items, newMovie],
        },
      }));

      return { previousMovies };
    },

    // On error, rollback
    onError: (err, newMovie, context) => {
      queryClient.setQueryData(
        orpc.media.list.getQueryKey(),
        context.previousMovies,
      );
    },

    // Always refetch after success/error
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.media.list.getQueryKey(),
      });
    },
  });

  return (
    <div>
      <MovieList movies={data.data.items} />
      <CreateMovieForm onSubmit={createMovie.mutate} />
    </div>
  );
}
```

---

### ✅ Pattern 5: Parallel queries

**When:** Need multiple independent data sources

```tsx
export const Route = createFileRoute("/dashboard/")({
  loader: async ({ context }) => {
    // Fetch multiple queries in parallel
    await Promise.all([
      context.queryClient.ensureQueryData(
        orpc.media.list.queryOptions({
          input: { status: ["PUBLISHED"] },
        }),
      ),
      context.queryClient.ensureQueryData(orpc.genres.list.queryOptions()),
      context.queryClient.ensureQueryData(orpc.creators.list.queryOptions()),
    ]);
  },
});

function RouteComponent() {
  const { data: movies } = useSuspenseQuery(
    orpc.media.list.queryOptions({
      input: { status: ["PUBLISHED"] },
    }),
  );

  const { data: genres } = useSuspenseQuery(orpc.genres.list.queryOptions());

  const { data: creators } = useSuspenseQuery(
    orpc.creators.list.queryOptions(),
  );

  return (
    <Dashboard
      movies={movies.data.items}
      genres={genres.data}
      creators={creators.data}
    />
  );
}
```

---

### ✅ Pattern 6: Server-only data (no client caching)

**When:** Sensitive data, one-time data, or data that shouldn't be cached

```tsx
export const Route = createFileRoute("/admin/analytics/")({
  loader: async ({ context }) => {
    // Fetch directly without caching
    const analytics = await orpc.admin.analytics.query();

    return { analytics };
  },
});

function RouteComponent() {
  const { analytics } = Route.useLoaderData();

  return <AnalyticsDashboard data={analytics} />;
}
```

---

## 🚫 What NOT to do

### ❌ Pattern: `prefetchQuery` + `useQuery`

```tsx
// ❌ Bad: Data might be undefined
loader: async ({ context }) => {
  await context.queryClient.prefetchQuery(...); // Might fail silently
},

function Component() {
  const { data } = useQuery(...); // data can be undefined!

  return <div>{data?.items.length}</div>; // Need null checks
}
```

**Why bad:**

- ❌ Data can be undefined
- ❌ Need null checks everywhere
- ❌ May re-fetch unnecessarily
- ❌ No loading state

---

## 📋 Quick Decision Tree

```
Do you need the data in the component?
├─ Yes
│  ├─ Does it depend on URL params?
│  │  ├─ Yes → Use loaderDeps + useSuspenseQuery
│  │  └─ No → Use ensureQueryData + useSuspenseQuery
│  │
│  └─ Is it sensitive/one-time data?
│     ├─ Yes → Fetch in loader, return data, use useLoaderData
│     └─ No → Use ensureQueryData + useSuspenseQuery
│
└─ No (just prefetch for later)
   └─ Use ensureQueryData in loader only
```

---

## 🎯 Your Current Setup

**Before (Not optimal):**

```tsx
loader: async ({ context }) => {
  await context.queryClient.prefetchQuery(...); // ❌
},

function Component() {
  const { data } = useQuery(...); // ❌ data can be undefined
}
```

**After (Optimal):**

```tsx
loader: async ({ context }) => {
  await context.queryClient.ensureQueryData(...); // ✅
},

function Component() {
  const { data } = useSuspenseQuery(...); // ✅ data guaranteed
}
```

---

## 📚 Key Takeaways

1. **Always use `ensureQueryData`** instead of `prefetchQuery` in loaders
2. **Always use `useSuspenseQuery`** instead of `useQuery` for loader data
3. **Use `loaderDeps`** for dynamic queries based on URL
4. **Return data from loader** when you need it in multiple places
5. **Parallel fetch** independent queries with `Promise.all`
6. **Use mutations** with optimistic updates for better UX

---

## 🔗 Resources

- [TanStack Router Loaders](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading)
- [TanStack Query Suspense](https://tanstack.com/query/latest/docs/framework/react/guides/suspense)
- [ORPC React Query](https://orpc.unnoq.com/docs/integrations/react-query)
