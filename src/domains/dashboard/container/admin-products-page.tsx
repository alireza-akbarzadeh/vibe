/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
import {
    type ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Loader2, PackagePlus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Table } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/forms/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    useAdminArchiveProduct,
    useAdminCreateProduct,
    useAdminProducts,
    useAdminUpdateProduct,
} from "@/hooks/useAdminPolar";

type Product = {
    id: string;
    name: string;
    description: string | null;
    priceAmount: number;
    priceCurrency: string;
    recurringInterval: string | null;
    isRecurring: boolean;
};

export function AdminProductsPage() {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const { data, isLoading } = useAdminProducts();
    const createProduct = useAdminCreateProduct();
    const updateProduct = useAdminUpdateProduct();
    const archiveProduct = useAdminArchiveProduct();

    // Create form state
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        recurringInterval: "month" as "day" | "week" | "month" | "year",
        priceAmount: "",
        priceCurrency: "USD",
    });

    const handleCreateProduct = async () => {
        try {
            await createProduct.mutateAsync({
                name: newProduct.name,
                description: newProduct.description,
                recurringInterval: newProduct.recurringInterval,
                prices: [
                    {
                        priceAmount: Number.parseInt(newProduct.priceAmount) * 100,
                        priceCurrency: newProduct.priceCurrency,
                    },
                ],
            });

            toast.success("Product created successfully");
            setCreateDialogOpen(false);
            setNewProduct({
                name: "",
                description: "",
                recurringInterval: "month",
                priceAmount: "",
                priceCurrency: "USD",
            });
        } catch (error: any) {
            toast.error(error.message || "Failed to create product");
        }
    };

    const handleUpdateProduct = async () => {
        if (!selectedProduct) return;

        try {
            await updateProduct.mutateAsync({
                productId: selectedProduct.id,
                name: selectedProduct.name,
                description: selectedProduct.description,
            });

            toast.success("Product updated successfully");
            setEditDialogOpen(false);
            setSelectedProduct(null);
        } catch (error: any) {
            toast.error(error.message || "Failed to update product");
        }
    };

    const handleArchiveProduct = async (productId: string) => {
        if (!confirm("Are you sure you want to archive this product?")) return;

        try {
            await archiveProduct.mutateAsync(productId);
            toast.success("Product archived successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to archive product");
        }
    };

    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: "name",
            header: "Product",
            cell: ({ row }) => (
                <div>
                    <p className="font-medium">{row.original.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {row.original.description}
                    </p>
                </div>
            ),
        },
        {
            accessorKey: "priceAmount",
            header: "Price",
            cell: ({ row }) =>
                new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: row.original.priceCurrency,
                }).format(row.original.priceAmount / 100),
        },
        {
            accessorKey: "recurringInterval",
            header: "Interval",
            cell: ({ row }) => (
                <span className="capitalize">
                    {row.original.recurringInterval || "One-time"}
                </span>
            ),
        },
        {
            accessorKey: "isRecurring",
            header: "Recurring",
            cell: ({ row }) => (
                <Badge variant={row.original.isRecurring ? "default" : "secondary"}>
                    {row.original.isRecurring ? "Yes" : "No"}
                </Badge>
            ),
        },
        {
            id: "actions",
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setSelectedProduct(row.original);
                            setEditDialogOpen(true);
                        }}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleArchiveProduct(row.original.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: data?.products || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="space-y-8 p-4 md:p-6 lg:p-10 max-w-350 mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">
                        Manage your subscription products and pricing
                    </p>
                </div>
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PackagePlus className="h-4 w-4 mr-2" />
                            Create Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-125">
                        <DialogHeader>
                            <DialogTitle>Create New Product</DialogTitle>
                            <DialogDescription>
                                Create a new subscription product with pricing
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Premium Plan"
                                    value={newProduct.name}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, name: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="All premium features included..."
                                    value={newProduct.description}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="9.99"
                                        value={newProduct.priceAmount}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                priceAmount: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Currency</Label>
                                    <Select
                                        value={newProduct.priceCurrency}
                                        onValueChange={(value) =>
                                            setNewProduct({ ...newProduct, priceCurrency: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">USD</SelectItem>
                                            <SelectItem value="EUR">EUR</SelectItem>
                                            <SelectItem value="GBP">GBP</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="interval">Billing Interval</Label>
                                <Select
                                    value={newProduct.recurringInterval}
                                    onValueChange={(value: any) =>
                                        setNewProduct({ ...newProduct, recurringInterval: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="day">Daily</SelectItem>
                                        <SelectItem value="week">Weekly</SelectItem>
                                        <SelectItem value="month">Monthly</SelectItem>
                                        <SelectItem value="year">Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setCreateDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateProduct}
                                disabled={
                                    !newProduct.name || !newProduct.priceAmount ||
                                    createProduct.isPending
                                }
                            >
                                {createProduct.isPending && (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                )}
                                Create Product
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Table.Root table={table}>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-6 py-4 bg-muted/5 border-b border-border/40 rounded-t-[2rem]">
                            <Table.Search columnId="name" placeholder="Search products..." />
                            <div className="text-sm text-muted-foreground">
                                {table.getFilteredRowModel().rows.length} Products
                            </div>
                        </div>

                        <div className="px-2">
                            <Table.Body<Product> columnsCount={5} />
                        </div>

                        <div className="px-6 py-4 border-t border-border/40">
                            <Table.Pagination />
                        </div>
                    </div>
                </Table.Root>
            )}

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogDescription>
                            Update product name and description
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Product Name</Label>
                            <Input
                                id="edit-name"
                                value={selectedProduct?.name || ""}
                                onChange={(e) =>
                                    setSelectedProduct({
                                        ...selectedProduct,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={selectedProduct?.description || ""}
                                onChange={(e) =>
                                    setSelectedProduct({
                                        ...selectedProduct,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateProduct}
                            disabled={updateProduct.isPending}
                        >
                            {updateProduct.isPending && (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            )}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
