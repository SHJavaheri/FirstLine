import type { AccountRole } from "@/types";

export type AdminSeed = {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: AccountRole;
};

export const adminSeed: AdminSeed[] = [
  {
    firstName: "FirstLine",
    lastName: "Admin",
    email: "owner@firstline-demo.com",
    passwordHash: "$2b$12$1MSH.1LpYcamHSbTfuwB2OyM94hU7lAfFxHOZV7US9JUberNOjlUK",
    role: "ADMIN",
  },
];
