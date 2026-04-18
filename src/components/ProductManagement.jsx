import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Plus, Edit, Trash2, ImageIcon } from "lucide-react";
import axios from "axios";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";

export function ProductManagement() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [products, setProducts] = useState([]);

  const [strikePrice, setStrikePrice] = useState("");
  const [rating, setRating] = useState("");
  const [label, setLabel] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [hoverImageFile, setHoverImageFile] = useState(null);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [hoverPreview, setHoverPreview] = useState(null);

  const [productId, setProductId] = useState("");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  // ================= ADD =================
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageData = {};
      let hoverImageData = {};

      if (imageFile) imageData = await uploadToCloudinary(imageFile);
      if (hoverImageFile)
        hoverImageData = await uploadToCloudinary(hoverImageFile);

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/product`, {
        name,
        price,
        category,
        image_url: imageData.url || "",
        public_id: imageData.public_id || "",
        hover_image: hoverImageData.url || "",
        strikeout_price: strikePrice,
        rating,
        label,
      });

      resetForm();
      setIsAddDialogOpen(false);
      productDetails();
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      let imageData = {};
      let hoverImageData = {};

      if (imageFile) imageData = await uploadToCloudinary(imageFile);
      if (hoverImageFile)
        hoverImageData = await uploadToCloudinary(hoverImageFile);

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/product/${productId}`,
        {
          name,
          price,
          category,
          image_url: imageData.url || undefined,
          public_id: imageData.public_id || undefined,
          hover_image: hoverImageData.url || undefined,
          strikeout_price: strikePrice,
          rating,
          label,
        },
      );

      resetForm();
      setIsEditDialogOpen(false);
      productDetails();
    } catch (err) {
      console.log(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDeleteProduct = async (id) => {
    setDeleteLoadingId(id);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/product/${id}`,
      );
      productDetails();
    } catch (err) {
      console.log(err.message);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  // ================= EDIT =================
  const handleEdit = (p) => {
    setName(p.product_name);
    setPrice(p.product_price);
    setCategory(p.category_id);
    setProductId(p.product_id);
    setStrikePrice(p.strikeout_price);
    setRating(p.rating);
    setLabel(p.label);

    setPreviewUrl(p.image_url);
    setHoverPreview(p.hover_image);

    setIsEditDialogOpen(true);
  };

  // ================= RESET =================
  const resetForm = () => {
    setName("");
    setPrice("");
    setCategory("");
    setStrikePrice("");
    setRating("");
    setLabel("");
    setImageFile(null);
    setHoverImageFile(null);
    setPreviewUrl(null);
    setHoverPreview(null);
    setProductId("");
  };

  // ================= FETCH =================
  const handleCategory = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/category`,
    );
    setCategoryList(res.data);
  };

  const productDetails = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/product`,
    );
    setProducts(res.data);
  };

  useEffect(() => {
    handleCategory();
    productDetails();
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Product Management</h1>

        {/* ADD */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 w-4 h-4" /> Add Product
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddProduct} className="grid gap-4">
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryList.map((c) => (
                    <SelectItem key={c.category_id} value={c.category_id}>
                      {c.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid grid-cols-3 gap-4">
                <Input
                  placeholder="Strike Price"
                  type="number"
                  value={strikePrice}
                  onChange={(e) => setStrikePrice(e.target.value)}
                />
                <Input
                  placeholder="Rating"
                  type="number"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                />
                <Select value={label} onValueChange={setLabel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Label" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hot">Hot</SelectItem>
                    <SelectItem value="viral">Viral</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* IMAGE */}
              <Input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImageFile(file);
                  setPreviewUrl(file ? URL.createObjectURL(file) : null);
                }}
                required
              />

              {previewUrl && (
                <img
                  src={previewUrl}
                  className="w-20 h-20 rounded border object-cover"
                />
              )}

              {/* HOVER IMAGE */}
              <Input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setHoverImageFile(file);
                  setHoverPreview(file ? URL.createObjectURL(file) : null);
                }}
              />

              {hoverPreview && (
                <img
                  src={hoverPreview}
                  className="w-20 h-20 rounded border object-cover"
                />
              )}

              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>List</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Original Price</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.map((p) => (
                <TableRow key={p.product_id}>
                  <TableCell>
                    <div className="flex gap-2">
                      <img
                        src={p.image_url || "/placeholder.png"}
                        className="w-10 h-10 rounded object-cover"
                      />
                      {p.hover_image && (
                        <img
                          src={p.hover_image}
                          className="w-10 h-10 rounded object-cover opacity-60"
                        />
                      )}
                    </div>
                  </TableCell>

                  <TableCell>{p.product_name}</TableCell>
                  <TableCell>₹{p.product_price}</TableCell>
                  <TableCell>₹{p.strikeout_price}</TableCell>
                  <TableCell>{p.rating}</TableCell>
                  <TableCell>
                    <Badge>{p.label}</Badge>
                  </TableCell>

                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={deleteLoadingId === p.product_id}
                      onClick={() => handleDeleteProduct(p.product_id)}
                    >
                      {deleteLoadingId === p.product_id ? (
                        "Deleting..."
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
