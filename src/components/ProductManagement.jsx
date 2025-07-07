import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Plus, Edit, Trash2, ImageIcon, X } from "lucide-react";
import axios from "axios";
import { useEffect } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";

export function ProductManagement() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [addLoading, setAddLoading] = useState(false);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      let imageData = {};
      if (imageFile) imageData = await uploadToCloudinary(imageFile);

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/product`,
        {
          name,
          price,
          desc,
          category,
          stock,
          status,
          image_url: imageData.url || "",
          public_id: imageData.public_id || "",
        }
      );

      if (res.status === 200) alert("Product Added Successfully");
      setIsAddDialogOpen(false);
      resetForm();
      productDetails();
    } catch (err) {
      console.log(err.message);
    } finally {
      setAddLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let imageData = {};
      if (imageFile) imageData = await uploadToCloudinary(imageFile);

      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/product/${productId}`,
        {
          name,
          price,
          desc,
          category,
          stock,
          status,
          image_url: imageData.url || undefined,
          public_id: imageData.public_id || undefined,
        }
      );

      if (res.status === 200) {
        console.log("Updated Successfully");
        setIsEditDialogOpen(false);
        resetForm();
        productDetails();
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setDesc("");
    setCategory("");
    setStock("");
    setStatus("");
    setImageFile(null);
    setProductId("");
    setPreviewUrl(null);
  };

  const handleDeleteProduct = async (id) => {
    setAddLoading(true);
    try {
      await axios.delete(
        ` ${import.meta.env.VITE_API_BASE_URL}/api/product/${id}`
      );
      productDetails();
    } catch (err) {
      console.log(err.message);
    } finally {
      setAddLoading(false);
    }
  };

  const handleEdit = (product) => {
    setName(product.product_name);
    setDesc(product.product_desc);
    setPrice(product.product_price);
    setStatus(product.status);
    setStock(product.stock);
    setProductId(product.product_id);
    setCategory(product.category_id);
    setIsEditDialogOpen(true);
  };

  const handleCategory = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/category`
      );
      setCategoryList(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const productDetails = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/product`
      );
      setProducts(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    handleCategory();
    productDetails();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage your products</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Fill product details below</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddProduct} className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={category}
                    onValueChange={(val) => setCategory(val)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryList.map((category) => (
                        <SelectItem
                          key={category.category_id}
                          value={String(category.category_id)}
                          required
                        >
                          {category.category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Product Image</Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setImageFile(file);
                        setPreviewUrl(file ? URL.createObjectURL(file) : null);
                      }}
                      className="cursor-pointer"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={addLoading}>
                  {addLoading ? "Adding..." : "Add Product"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Product inventory list</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.product_id}>
                  <TableCell>
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>{product.product_name}</TableCell>
                  <TableCell>{product.category_name}</TableCell>
                  <TableCell>₹{product.product_price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-xl">
                        <DialogHeader>
                          <DialogTitle>Edit Product</DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={handleUpdate}
                          className="grid gap-4 py-4"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Price</Label>
                              <Input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <Label>Description</Label>
                          <Textarea
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            rows={3}
                            required
                          />
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Category</Label>
                              <Select
                                value={category}
                                onValueChange={setCategory}
                                required
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {categoryList.map((cat) => (
                                    <SelectItem
                                      key={cat.category_id}
                                      value={cat.category_id}
                                      required
                                    >
                                      {cat.category_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Stock</Label>
                              <Input
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Status</Label>
                              <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Active">Active</SelectItem>
                                  <SelectItem value="Inactive">
                                    Inactive
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Change Image</Label>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setImageFile(e.target.files[0])}
                            />
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline" onClick={resetForm}>
                                Cancel
                              </Button>
                            </DialogClose>
                            <Button type="submit">Save Changes</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.product_id)}
                      disabled={addLoading}
                    >
                      {addLoading ? (
                        <span className="text-xs">Deleting...</span>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
