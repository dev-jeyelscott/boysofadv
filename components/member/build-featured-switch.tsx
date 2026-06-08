"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

interface BuildFeaturedSwitchProps {
  defaultChecked?: boolean;
}

export function BuildFeaturedSwitch({
  defaultChecked = false,
}: BuildFeaturedSwitchProps) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <>
      <input
        type="hidden"
        name="isFeatured"
        value={checked ? "true" : "false"}
      />

      <Switch
        checked={checked}
        onCheckedChange={setChecked}
        className="
          border border-white/20
          bg-white/20
          data-[state=checked]:bg-red-600
          data-[state=unchecked]:bg-white/20
          [&>span]:bg-white
        "
      />
    </>
  );
}
