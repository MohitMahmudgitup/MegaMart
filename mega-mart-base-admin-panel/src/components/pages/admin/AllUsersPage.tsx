"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  UserIcon,
  UsersIcon,
  CalendarDaysIcon,
  PackageIcon,
} from "lucide-react";
import { UserStatCard } from "@/components/shared/userStatCard";
import { UserFilterBar } from "@/components/shared/UserFilterBar";
import { useGetAllUsersQuery, useUpdateStatusMutation } from "@/redux/featured/user/userApi";
import { format } from "date-fns/esm";
import PaginationControls from "@/components/categorise/PaginationControls";

const AllUsersPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [updateStatus] = useUpdateStatusMutation();

  const { data: users = [] , refetch } = useGetAllUsersQuery();

  // Always run hooks
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = (user.name?.toLowerCase().includes(search.toLowerCase()) ?? false) || (user.email?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const totalOrders = users.reduce((sum, u) => sum + (u.orders ?? 0), 0);
  const newThisMonth = users.length;
  return (
    <div className="p-4 py-6 space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <UserStatCard
          title="All Users"
          value={String(totalUsers)}
          subtitle="+2 from last week"
          icon={<UserIcon className="h-6 w-6 text-pink-600" />}
        />
        <UserStatCard
          title="Active Users"
          value={String(activeUsers)}
          subtitle={`${Math.round(
            (activeUsers / totalUsers) * 100 || 0
          )}% active rate`}
          icon={<UsersIcon className="h-6 w-6 text-green-600" />}
        />
        <UserStatCard
          title="New This Month"
          value={String(newThisMonth)}
          subtitle="+50% from last month"
          icon={<CalendarDaysIcon className="h-6 w-6 text-pink-600" />}
        />
        <UserStatCard
          title="Total Products Sell"
          value={String(totalOrders)}
          subtitle="+20% from last month"
          icon={<PackageIcon className="h-6 w-6 text-pink-600" />}
        />
      </div>

      {/* Filter Bar */}
      <UserFilterBar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* User Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="border border-[#CFCFCF] ">
              <TableHead className="text-center">User</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Join Date</TableHead>
              <TableHead className="text-center">Orders</TableHead>
              <TableHead className="text-center">Wallet Point</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user, index) => (
              <TableRow key={index} className="border-none">
                <TableCell className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm text-muted-foreground font-medium">
                      {user.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium ">{user.name}</div>
                      <div className="text-xs text-muted-foreground ">
                        {user.role}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-center">{user.email}</TableCell>
                <TableCell className="py-4 text-center">
                  <select
                    value={user.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      try {
                        const res: any = await updateStatus({
                          id: user._id!,
                          status: newStatus,
                        }).unwrap();
                        refetch();

                      } catch (error) {
                        alert("Something went wrong!");
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : user.status === "inactive"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </TableCell>

                <TableCell className="py-4 text-center">
                  {user.createdAt
                    ? format(new Date(user.createdAt), "MMM dd, yyyy")
                    : "—"}
                </TableCell>
                <TableCell className="py-4 text-center">
                  {user.orders ?? 0}
                </TableCell>
                <TableCell className="py-4 text-center">
                  {user.walletPoint ?? 0}
                </TableCell>
                <TableCell className="py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <PaginationControls
        currentPage={currentPage}
        totalItems={filteredUsers.length}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default AllUsersPage;
