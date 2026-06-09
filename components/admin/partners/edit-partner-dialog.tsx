"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { updatePartner } from "@/app/(protected)/admin/partners/actions";
import { PartnerRow } from "@/lib/constants/partner";
import { PartnerLogoUploader } from "./partner-logo-uploader";

type Props = {
  partner: PartnerRow | null;
  onClose: () => void;
};

export function EditPartnerDialog({ partner, onClose }: Props) {
  const [logoUrl, setLogoUrl] = useState(partner?.logoUrl ?? "");
  const [logoKey, setLogoKey] = useState(partner?.logoKey ?? "");

  useEffect(() => {
    setLogoUrl(partner?.logoUrl ?? "");
    setLogoKey(partner?.logoKey ?? "");
  }, [partner?.id, partner?.logoUrl, partner?.logoKey]);

  if (!partner) return null;

  const currentPartner = partner;

  async function action(formData: FormData): Promise<void> {
    formData.set("logoUrl", logoUrl);
    formData.set("logoKey", logoKey);

    await updatePartner(currentPartner.id, formData);

    onClose();
  }

  return (
    <Dialog open={!!partner} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-zinc-950 text-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase">
            Edit Partner
          </DialogTitle>

          <DialogDescription className="text-white/50">
            Update partner details. Current logo will stay unless you replace or
            remove it.
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Partner Name</Label>
              <Input
                id="edit-name"
                name="name"
                defaultValue={partner.name}
                placeholder="JVT Performance"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                name="category"
                defaultValue={partner.category ?? ""}
                placeholder="Performance Parts"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-websiteUrl">Website URL</Label>
              <Input
                id="edit-websiteUrl"
                name="websiteUrl"
                type="url"
                defaultValue={partner.websiteUrl ?? ""}
                placeholder="https://example.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-facebookUrl">Facebook URL</Label>
              <Input
                id="edit-facebookUrl"
                name="facebookUrl"
                type="url"
                defaultValue={partner.facebookUrl ?? ""}
                placeholder="https://facebook.com/example"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              name="description"
              rows={4}
              defaultValue={partner.description ?? ""}
              placeholder="Short partner description..."
            />
          </div>

          <div className="grid gap-2">
            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <PartnerLogoUploader
                key={partner.id}
                defaultLogoUrl={logoUrl}
                defaultLogoKey={logoKey}
                onChange={(value) => {
                  setLogoUrl(value.logoUrl);
                  setLogoKey(value.logoKey);
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 p-4">
            <Checkbox
              id="edit-isOfficial"
              name="isOfficial"
              defaultChecked={partner.isOfficial}
            />

            <Label
              htmlFor="edit-isOfficial"
              className="cursor-pointer text-sm font-medium text-white/70"
            >
              Mark as official partner
            </Label>
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>

            <Select name="status" defaultValue={partner.status}>
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

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="border-white/20 bg-black text-white hover:bg-white/10 hover:text-white"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-red-600 font-black uppercase text-white hover:bg-red-500"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
