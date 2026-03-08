"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useFineRule } from "@/hooks/use-fine-rule";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function FineRulesSection() {
  const { register, handleSubmit, errors, isSubmitting, isValid, isLoading } =
    useFineRule();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="h-full">
      <div className="sticky top-[48px] bg-[var(--background)] ">
        <div className="flex justify-between items-center p-3">
          <h3 className="font-semibold text-2xl">Fine Rules Settings</h3>
        </div>
        <Separator />
      </div>
      <form onSubmit={handleSubmit} className="p-4 grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Charges Per Day (Taka)
          </label>
          <Input
            type="number"
            placeholder="Enter per day charge"
            {...register("chargesPerDay", {
              required: "This field is required",
              min: { value: 0, message: "Cannot be negative" },
              valueAsNumber: true,
            })}
          />
          {errors.chargesPerDay && (
            <p className="text-xs text-red-500 font-medium">
              {errors.chargesPerDay.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Replacement Fee (Taka)
          </label>
          <Input
            type="number"
            placeholder="Fee for lost or damaged books"
            {...register("replacementFee", {
              required: "This field is required",
              min: { value: 0, message: "Cannot be negative" },
              valueAsNumber: true,
            })}
          />
          {errors.replacementFee && (
            <p className="text-xs text-red-500 font-medium">
              {errors.replacementFee.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Grace Period (Days)
          </label>
          <Input
            type="number"
            placeholder="Days before fines start"
            {...register("gracePeriod", {
              required: "This field is required",
              min: { value: 0, message: "Cannot be negative" },
              valueAsNumber: true,
            })}
          />
          {errors.gracePeriod && (
            <p className="text-xs text-red-500 font-medium">
              {errors.gracePeriod.message}
            </p>
          )}
        </div>

        <div className="col-span-2 flex justify-end gap-3 pt-4">
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
            className="font-bold uppercase tracking-widest text-[11px]"
          >
            Save Settings
          </Button>
        </div>
      </form>
    </section>
  );
}
