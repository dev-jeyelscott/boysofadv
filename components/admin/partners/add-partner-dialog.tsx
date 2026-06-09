"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createPartner } from "@/app/(protected)/admin/partners/actions";
import { PartnerLogoUploader } from "./partner-logo-uploader";

export function AddPartnerDialog() {
  const [logoUrl, setLogoUrl] = useState("");
  const [logoKey, setLogoKey] = useState("");
  const [open, setOpen] = useState(false);

  async function action(formData: FormData) {
    formData.set("logoUrl", logoUrl);

    await createPartner(formData);

    setLogoUrl("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-white/40 bg-black text-white hover:bg-white/10 hover:text-white"
        >
          <Plus className="size-4" />
          Add Partner
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-zinc-950 text-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase">
            Add Partner
          </DialogTitle>

          <DialogDescription className="text-white/50">
            Create a new official partner brand or shop.
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Partner Name</Label>
              <Input id="name" name="name" placeholder="JVT Performance" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                placeholder="Performance Parts"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                name="websiteUrl"
                type="url"
                placeholder="https://example.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="facebookUrl">Facebook URL</Label>
              <Input
                id="facebookUrl"
                name="facebookUrl"
                type="url"
                placeholder="https://facebook.com/example"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Short partner description..."
            />
          </div>

          <div className="grid gap-2">
            <Label>Logo</Label>

            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              {logoUrl ? (
                <div className="mb-4 flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoUrl}
                    alt="Partner logo"
                    className="h-16 w-16 rounded-xl object-cover"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-white/20 bg-black text-white hover:bg-white/10"
                    onClick={() => setLogoUrl("")}
                  >
                    Remove
                  </Button>
                </div>
              ) : null}

              <input type="hidden" value={logoKey} />

              <div className="md:col-span-2">
                <PartnerLogoUploader
                  defaultLogoKey={logoUrl}
                  onChange={(value) => {
                    setLogoUrl(value.logoUrl);
                    setLogoKey(value.logoKey ?? "");
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 p-4">
            <Checkbox id="isOfficial" name="isOfficial" />

            <Label
              htmlFor="isOfficial"
              className="cursor-pointer text-sm font-medium text-white/70"
            >
              Mark as official partner
            </Label>
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>

            <Select name="status" defaultValue="draft">
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              className="bg-red-600 font-black uppercase text-white hover:bg-red-500"
            >
              Save Partner
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
