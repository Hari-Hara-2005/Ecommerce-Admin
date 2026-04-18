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

  const [link, setLink] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const [addLoading, setAddLoading] = useState(false);

  const resetForm = () => {
    setImageFile(null);
    setId("");
    setPreviewUrl(null);
    setLink("");
    setIsMobile(false);
  };

  const bannerDetails = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/banner`,
      );
      setBanner(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    bannerDetails();
  }, []);

  // ✅ ADD BANNER
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
          link: link,
          is_mobile: isMobile,
        },
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

  // ✅ UPDATE BANNER
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
          link: link,
          is_mobile: isMobile,
        },
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

  // ✅ DELETE
  const handleDeleteBanner = async (id) => {
    setAddLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/banner/${id}`,
      );
      bannerDetails();
    } catch (err) {
      console.log(err.message);
    } finally {
      setAddLoading(false);
    }
  };

  // ✅ EDIT LOAD DATA
  const handleEdit = (banner) => {
    setId(banner.id);
    setLink(banner.link || "");
    setIsMobile(banner.is_mobile || false);
    setPreviewUrl(banner.image_url);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Banner Management</h1>
          <p className="text-muted-foreground">Add, edit or remove banners</p>
        </div>

        {/* ADD DIALOG */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add Banner
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Banner</DialogTitle>
              <DialogDescription>Upload banner + add link</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddBanner} className="space-y-4">
              {/* IMAGE */}
              <div className="space-y-2">
                <Label>Banner Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setImageFile(file);
                      setPreviewUrl(file ? URL.createObjectURL(file) : null);
                    }}
                  />

                  <div className="w-24 h-24 border rounded flex items-center justify-center">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        className="w-full h-full object-cover rounded"
                        alt="preview"
                      />
                    ) : (
                      <ImageIcon />
                    )}
                  </div>
                </div>
              </div>

              {/* LINK */}
              <div className="space-y-2">
                <Label>Banner Link</Label>
                <Input
                  type="text"
                  placeholder="https://example.com"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>

              {/* MOBILE */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isMobile}
                  onChange={(e) => setIsMobile(e.target.checked)}
                />
                <Label>Is Mobile Banner</Label>
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

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>All Banners</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <img
                      src={banner.image_url}
                      className="w-20 h-20 object-cover"
                    />
                  </TableCell>

                  <TableCell>{banner.link}</TableCell>
                  <TableCell>{banner.is_mobile ? "Yes" : "No"}</TableCell>

                  <TableCell className="flex gap-2 justify-end">
                    <Button size="icon" onClick={() => handleEdit(banner)}>
                      <Edit />
                    </Button>

                    <Button
                      size="icon"
                      onClick={() => handleDeleteBanner(banner.id)}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* EDIT DIALOG */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-4">
            <Input
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
            />

            <Input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Link"
            />

            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={isMobile}
                onChange={(e) => setIsMobile(e.target.checked)}
              />
              <Label>Mobile Banner</Label>
            </div>

            <Button type="submit">Update</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
