import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, ImageIcon } from "lucide-react";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export function BannerManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [banners, setBanner] = useState([]);
  const [Id, setId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [addLoading, setAddLoading] = useState(false);

  const resetForm = () => {
    setImageFile(null);
    setId("");
    setPreviewUrl(null);
  };

  const bannerDetails = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/banner`
      );
      setBanner(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    bannerDetails();
  }, []);

  const handleAddBanner = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      let imageData = {};
      if (imageFile) imageData = await uploadToCloudinary(imageFile);

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/banner`,
        {
          image_url: imageData.url || "",
          public_id: imageData.public_id || "",
        }
      );

      if (res.status === 200) {
        alert("Banner Added Successfully");
        setIsAddDialogOpen(false);
        resetForm();
        bannerDetails();
      }
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
        `${import.meta.env.VITE_API_BASE_URL}/api/banner/${Id}`,
        {
          image_url: imageData.url || undefined,
          public_id: imageData.public_id || undefined,
        }
      );

      if (res.status === 200) {
        setIsEditDialogOpen(false);
        resetForm();
        bannerDetails();
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleDeleteBanner = async (id) => {
    setAddLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/banner/${id}`
      );
      bannerDetails();
    } catch (err) {
      console.log(err.message);
    } finally {
      setAddLoading(false);
    }
  };

  const handleEdit = (banner) => {
    setId(banner.id);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Banner Management</h1>
          <p className="text-muted-foreground">Add, edit or remove banners</p>
        </div>

        {/* Add Banner Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Banner</DialogTitle>
              <DialogDescription>Upload a new banner image</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddBanner} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">Banner Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setImageFile(file);
                      setPreviewUrl(file ? URL.createObjectURL(file) : null);
                    }}
                  />
                  <div className="w-24 h-24 border border-dashed rounded-md flex items-center justify-center bg-muted">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        className="w-full h-full object-cover rounded"
                        alt="Preview"
                      />
                    ) : (
                      <ImageIcon className="text-muted-foreground w-6 h-6" />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={addLoading}>
                  {addLoading ? "Adding..." : "Add Banner"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Banners</CardTitle>
          <CardDescription>
            Click edit or delete to modify banners
          </CardDescription>
        </CardHeader>
        <CardContent>
          {banners.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-10">
              No banners added yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <img
                        src={banner.image_url || "/placeholder.svg"}
                        className="w-20 h-20 object-cover rounded-md border"
                        alt="banner"
                      />
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      {/* Edit Dialog */}
                      <Dialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(banner)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl">
                          <DialogHeader>
                            <DialogTitle>Edit Banner</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="space-y-2">
                              <Label>Update Image</Label>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  setImageFile(e.target.files[0])
                                }
                              />
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline" onClick={resetForm}>
                                  Cancel
                                </Button>
                              </DialogClose>
                              <Button type="submit">Save</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteBanner(banner.id)}
                        disabled={addLoading}
                      >
                        {addLoading ? (
                          <span className="text-xs">...</span>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
