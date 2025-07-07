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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Plus, Edit, Trash2, ImageIcon } from "lucide-react";
import axios from "axios";
import { useEffect } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
export function CategoryMangement() {
  const [name, setName] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [category, setCategory] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [categoryId, setCategoryId] = useState(undefined);
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const data = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/category`,
        {
          name,
        }
      );
      if (data.status === 200) {
        alert("Added the category SuccessFully..!");
      }
      setIsAddDialogOpen(false);
      setName("");
      categoryDetails();
    } catch (error) {
      console.log(error.message);
    }
  };
  const categoryDetails = async () => {
    try {
      const data = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/category`
      );
      setCategory(data.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    categoryDetails();
  }, []);

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(
        ` ${import.meta.env.VITE_API_BASE_URL}/api/category/${id}`
      );
      console.log("deleted..!");
      categoryDetails();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        ` ${import.meta.env.VITE_API_BASE_URL}/api/category/${categoryId}`,
        { name }
      );
      if (response.status === 200) {
        console.log("Update Sucessfully..!");
        categoryDetails();
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = (category) => {
    setName(category.category_name);
    setCategoryId(category.category_id);
    setIsEditDialogOpen(true);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Category Management
          </h1>
          <p className="text-muted-foreground mt-3">
            Manage your category inventory and details
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Fill in the product details below to add a new item to your
                inventory.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter category name"
                  />
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
              <Button onClick={handleAddProduct}>Add Category</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Category</CardTitle>
          <CardDescription>Manage your Category </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {category.map((category) => (
                <TableRow key={category.category_id}>
                  <TableCell>{category.category_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                      >
                        <form>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit Product</DialogTitle>
                              <DialogDescription>
                                Make changes to your category here. Click save
                                when you&apos;re done.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="name">Category Name</Label>
                                  <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter product name"
                                  />
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button type="submit" onClick={handleUpdate}>
                                Save changes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </form>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleDeleteCategory(category.category_id)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
