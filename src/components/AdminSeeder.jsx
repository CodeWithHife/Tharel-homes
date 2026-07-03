"use client";
import { useEffect } from "react";
import { seedAdminUser } from "@/lib/storage";

export default function AdminSeeder() {
  useEffect(() => {
    seedAdminUser();
  }, []);
  return null;
}