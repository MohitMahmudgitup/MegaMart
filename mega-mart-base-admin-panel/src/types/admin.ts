export type Admin = {
  name: string;
  email: string;
  role: "admin" | "customer";
  status: "Active" | "Inactive";
  designation: string
};