import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { orpc } from '@/orpc/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Check } from 'lucide-react'

export const Route = createFileRoute('/(admin)/dashboard/subscriptions/plans/')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  const { data, isLoading } = useQuery({
    ...orpc.polar.listProducts.queryOptions({
      input: {},
    }),
  });

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage available subscription plans and pricing
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      ) : data && data.products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.products.map((product) => {
            const price = product.prices?.[0];
            const priceAmount = price && 'priceAmount' in price ? price.priceAmount : 0;
            const priceCurrency = price && 'priceCurrency' in price ? price.priceCurrency : 'USD';
            const recurringInterval = price && 'recurringInterval' in price ? price.recurringInterval : null;

            return (
              <Card key={product.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{product.name}</CardTitle>
                    {product.isArchived && (
                      <Badge variant="secondary">Archived</Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {product.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <div>
                      <div className="text-4xl font-bold">
                        ${(priceAmount / 100).toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {priceCurrency} {recurringInterval ? `/ ${recurringInterval}` : ''}
                      </div>
                    </div>

                    {product.benefits && product.benefits.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-semibold">Features:</div>
                        <ul className="space-y-1">
                          {product.benefits.slice(0, 5).map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                              <span>{benefit.description}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No subscription plans found
        </div>
      )}
    </div>
  )
}
