"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface BuyerInfo {
  email: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  phone?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

interface BuyerInfoProps {
  onBack: () => void;
  onSubmit: (data: BuyerInfo) => void;
}

export function BuyerInfoForm({ onBack, onSubmit }: BuyerInfoProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BuyerInfo>();

  const onFormSubmit = (data: BuyerInfo) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Buyer Information</h3>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <span className="text-sm text-destructive">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="John"
              {...register("firstName", { required: "First name is required" })}
            />
            {errors.firstName && (
              <span className="text-sm text-destructive">
                {errors.firstName.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              {...register("lastName", { required: "Last name is required" })}
            />
            {errors.lastName && (
              <span className="text-sm text-destructive">
                {errors.lastName.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              placeholder="Acme Inc."
              {...register("businessName")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              {...register("phone", {
                pattern: {
                  value: /^\+?[1-9]\d{1,14}$/,
                  message: "Please enter a valid phone number",
                },
              })}
            />
            {errors.phone && (
              <span className="text-sm text-destructive">
                {errors.phone.message}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="streetAddress">Street Address</Label>
          <Input
            id="streetAddress"
            placeholder="123 Main St, Apt 4B"
            {...register("streetAddress")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="San Francisco"
              {...register("city")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Input id="state" placeholder="CA" {...register("state")} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              placeholder="United States"
              {...register("country")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              placeholder="94105"
              {...register("postalCode")}
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button type="submit" className="flex-1">
            Continue to Payment
          </Button>
        </div>
      </form>
    </div>
  );
}
