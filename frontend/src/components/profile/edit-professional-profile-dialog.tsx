"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type EditProfessionalProfileDialogProps = {
  profile: {
    bio?: string | null;
    professionalBio?: string | null;
    hourlyRate?: number | null;
    minRate?: number | null;
    maxRate?: number | null;
    pricingModel?: string | null;
    pricingDetails?: string | null;
    acceptsNewClients: boolean;
    offersInPerson: boolean;
    offersRemote: boolean;
  };
};

export function EditProfessionalProfileDialog({ profile }: EditProfessionalProfileDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bio: profile.bio || "",
    professionalBio: profile.professionalBio || "",
    hourlyRate: profile.hourlyRate?.toString() || "",
    minRate: profile.minRate?.toString() || "",
    maxRate: profile.maxRate?.toString() || "",
    pricingModel: profile.pricingModel || "",
    pricingDetails: profile.pricingDetails || "",
    acceptsNewClients: profile.acceptsNewClients,
    offersInPerson: profile.offersInPerson,
    offersRemote: profile.offersRemote,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/profile/professional", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio: formData.bio,
          professionalBio: formData.professionalBio,
          hourlyRate: formData.hourlyRate ? parseInt(formData.hourlyRate) : null,
          minRate: formData.minRate ? parseInt(formData.minRate) : null,
          maxRate: formData.maxRate ? parseInt(formData.maxRate) : null,
          pricingModel: formData.pricingModel,
          pricingDetails: formData.pricingDetails,
          acceptsNewClients: formData.acceptsNewClients,
          offersInPerson: formData.offersInPerson,
          offersRemote: formData.offersRemote,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update professional profile");
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating professional profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Professional Profile</DialogTitle>
          <DialogDescription>
            Update your professional information. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Bio (Short Introduction)</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={2}
                placeholder="Brief introduction about yourself (shown in profile header)..."
              />
              <p className="text-xs text-slate-500">This appears as a short introduction in your profile header</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionalBio">About (Detailed Professional Bio)</Label>
              <Textarea
                id="professionalBio"
                value={formData.professionalBio}
                onChange={(e) => setFormData({ ...formData, professionalBio: e.target.value })}
                rows={4}
                placeholder="Detailed description of your practice, expertise, and what makes you unique..."
              />
              <p className="text-xs text-slate-500">This appears in your About section (separate from your short bio)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricingModel">Pricing Model</Label>
              <Input
                id="pricingModel"
                value={formData.pricingModel}
                onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value })}
                placeholder="e.g., Hourly, Fixed Fee, Retainer"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                  placeholder="150"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minRate">Min Rate ($)</Label>
                <Input
                  id="minRate"
                  type="number"
                  value={formData.minRate}
                  onChange={(e) => setFormData({ ...formData, minRate: e.target.value })}
                  placeholder="100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxRate">Max Rate ($)</Label>
                <Input
                  id="maxRate"
                  type="number"
                  value={formData.maxRate}
                  onChange={(e) => setFormData({ ...formData, maxRate: e.target.value })}
                  placeholder="300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricingDetails">Pricing Details</Label>
              <Textarea
                id="pricingDetails"
                value={formData.pricingDetails}
                onChange={(e) => setFormData({ ...formData, pricingDetails: e.target.value })}
                rows={3}
                placeholder="Additional pricing information..."
              />
            </div>

            <div className="space-y-4 rounded-lg border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Availability Settings</h3>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="acceptsNewClients" className="cursor-pointer">
                  Accepting New Clients
                </Label>
                <Switch
                  id="acceptsNewClients"
                  checked={formData.acceptsNewClients}
                  onCheckedChange={(checked: boolean) =>
                    setFormData({ ...formData, acceptsNewClients: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="offersInPerson" className="cursor-pointer">
                  Offers In-Person Consultations
                </Label>
                <Switch
                  id="offersInPerson"
                  checked={formData.offersInPerson}
                  onCheckedChange={(checked: boolean) =>
                    setFormData({ ...formData, offersInPerson: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="offersRemote" className="cursor-pointer">
                  Offers Virtual Consultations
                </Label>
                <Switch
                  id="offersRemote"
                  checked={formData.offersRemote}
                  onCheckedChange={(checked: boolean) =>
                    setFormData({ ...formData, offersRemote: checked })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
