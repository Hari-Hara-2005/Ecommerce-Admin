import { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Check, X, Truck } from "lucide-react";
// Single record delivery price management

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function DeliveryPriceManagement() {
  const [editOpen, setEditOpen] = useState(false);
  const [priceData, setPriceData] = useState(null); // single object { id, price }
  const [editPrice, setEditPrice] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ FETCH single price
  const fetchPrice = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/delivery`,
      );
      setPriceData(res.data); // { id, price }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchPrice();
  }, []);

  // ✅ OPEN EDIT
  const openEdit = () => {
    setEditPrice(priceData?.price || "");
    setEditOpen(true);
  };

  // ✅ UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/delivery/${priceData.id}`,
        { price: editPrice },
      );
      if (res.status === 200) {
        setEditOpen(false);
        setEditPrice("");
        fetchPrice();
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Delivery Price</h1>
      </div>

      {/* SINGLE PRICE CARD */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Current Shipping Price
          </CardTitle>
        </CardHeader>

        <CardContent>
          {!priceData ? (
            <p className="text-center text-sm py-10 text-muted-foreground">
              No delivery price set.
            </p>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Shipping charge applied on orders below ₹249
                </p>
                <p className="text-4xl font-bold">₹ {priceData.price}</p>
              </div>
              <Button variant="outline" onClick={openEdit}>
                <Pencil className="w-4 h-4 mr-2" /> Edit Price
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* EDIT DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Delivery Price</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label>New Price (₹)</Label>
              <Input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                placeholder="Enter shipping price"
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  "Updating..."
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" /> Update
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
