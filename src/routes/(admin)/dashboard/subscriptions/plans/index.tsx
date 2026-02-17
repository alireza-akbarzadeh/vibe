import { createFileRoute } from "@tanstack/react-router";
import {
  Archive,
  CreditCard,
  Edit2,
  ExternalLink,
  Loader2,
  Package,
  Pencil,
  Save,
  TrendingUp,
  Users,
} from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAdminArchiveProduct,
  useAdminProducts,
  useAdminSubscriptionStats,
  useAdminUpdateProduct,
} from "@/hooks/useAdminPolar";

export const Route = createFileRoute("/(admin)/dashboard/subscriptions/plans/")(
  {
    component: RouteComponent,
  },
);

type Product = {
  id: string;
  name: string;
  description: string | null;
  priceAmount: number;
  priceCurrency: string;
  recurringInterval: "day" | "week" | "month" | "year" | null;
  isRecurring: boolean;
};

function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}

type EditState = {
  productId: string;
  name: string;
  description: string;
};

function RouteComponent() {
  const { data, isLoading } = useAdminProducts();
  const { data: stats } = useAdminSubscriptionStats();
  const updateProduct = useAdminUpdateProduct();
  const archiveProduct = useAdminArchiveProduct();

  const [editState, setEditState] = useState<EditState | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const editNameId = useId();
  const editDescId = useId();

  const handleSaveEdit = () => {
    if (!editState) return;
    updateProduct.mutate(
      {
        productId: editState.productId,
        name: editState.name,
        description: editState.description || null,
      },
      {
        onSuccess: () => {
          toast.success("Product updated");
          setEditState(null);
        },
        onError: () => toast.error("Failed to update product"),
      },
    );
  };

  const handleArchive = () => {
    if (!archiveTarget) return;
    archiveProduct.mutate(archiveTarget.id, {
      onSuccess: () => {
        toast.success("Product archived");
        setArchiveTarget(null);
      },
      onError: () => toast.error("Failed to archive product"),
    });
  };

  const products = (data?.products || []) as Product[];

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-10 max-w-350 mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Subscription Plans
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage available subscription plans and pricing from Polar
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a
            href="https://dashboard.polar.sh/products"
            target="_blank"
            rel="noopener noreferrer"
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Polar Dashboard
          </a>
        </Button>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active Plans</p>
                  <p className="text-xl font-bold">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-500/10 p-2">
                  <Users className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Active Subscribers
                  </p>
                  <p className="text-xl font-bold">
                    {stats.activeSubscriptions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">MRR</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(stats.totalMrr, stats.currency)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ARR</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(stats.totalArr, stats.currency)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      ) : products.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold mb-4">Active Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="flex flex-col overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <CardTitle className="text-lg truncate">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {product.description || "No description"}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-400 border-green-500/20 shrink-0"
                    >
                      {product.isRecurring ? "Recurring" : "One-time"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  {/* Price */}
                  <div className="rounded-lg bg-muted/30 p-3">
                    <div className="text-3xl font-bold">
                      {formatCurrency(
                        product.priceAmount,
                        product.priceCurrency,
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {product.priceCurrency}{" "}
                      {product.recurringInterval
                        ? `/ ${product.recurringInterval}`
                        : "one-time"}
                    </div>
                  </div>

                  {/* Product ID */}
                  <div className="pt-2 border-t border-border/30">
                    <code className="text-[10px] text-muted-foreground font-mono">
                      {product.id}
                    </code>
                  </div>
                </CardContent>

                {/* Actions */}
                <div className="flex items-center gap-2 p-4 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5"
                    onClick={() =>
                      setEditState({
                        productId: product.id,
                        name: product.name,
                        description: product.description || "",
                      })
                    }
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-red-400 hover:text-red-400 hover:bg-red-500/10"
                    onClick={() =>
                      setArchiveTarget({
                        id: product.id,
                        name: product.name,
                      })
                    }
                  >
                    <Archive className="h-3.5 w-3.5" />
                    Archive
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium">No subscription plans</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Create subscription products in your Polar dashboard to get
                started.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 gap-2"
                asChild
              >
                <a
                  href="https://dashboard.polar.sh/products/new"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  Create in Polar
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={!!editState}
        onOpenChange={(open) => !open && setEditState(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="w-5 h-5" />
              Edit Product
            </DialogTitle>
            <DialogDescription>
              Update product name and description. Pricing changes must be made
              in the Polar dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label
                htmlFor={editNameId}
                className="text-sm font-medium mb-1.5 block"
              >
                Name
              </label>
              <Input
                id={editNameId}
                value={editState?.name || ""}
                onChange={(e) =>
                  setEditState((prev) =>
                    prev ? { ...prev, name: e.target.value } : null,
                  )
                }
              />
            </div>
            <div>
              <label
                htmlFor={editDescId}
                className="text-sm font-medium mb-1.5 block"
              >
                Description
              </label>
              <Input
                id={editDescId}
                value={editState?.description || ""}
                onChange={(e) =>
                  setEditState((prev) =>
                    prev ? { ...prev, description: e.target.value } : null,
                  )
                }
                placeholder="Product description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditState(null)}
              disabled={updateProduct.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={updateProduct.isPending || !editState?.name}
              className="gap-2"
            >
              {updateProduct.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Confirmation */}
      <AlertDialog
        open={!!archiveTarget}
        onOpenChange={(open) => !open && setArchiveTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Archive className="w-5 h-5 text-orange-400" />
              Archive Product
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive{" "}
              <strong>{archiveTarget?.name}</strong>? Existing subscribers will
              keep their subscriptions, but new users will not be able to
              subscribe to this plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={archiveProduct.isPending}>
              Keep Active
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchive}
              disabled={archiveProduct.isPending}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {archiveProduct.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Archiving...
                </>
              ) : (
                "Archive Product"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
