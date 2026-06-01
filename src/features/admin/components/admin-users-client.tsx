"use client";

import { useState } from "react";
import { format } from "date-fns";
import { updateUserRoleAction, toggleUserStatusAction } from "@/features/admin/server/manage-users";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Shield, ShieldAlert, UserX, UserCheck } from "lucide-react";
import { toast } from "sonner";

type UserData = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  deletedAt: Date | null;
  _count: { generationHistory: number };
};

export function AdminUsersClient({ initialUsers }: { initialUsers: UserData[] }) {
  const [users, setUsers] = useState<UserData[]>(initialUsers);

  const handleRoleChange = async (userId: string, newRole: "USER" | "ADMIN") => {
    const res = await updateUserRoleAction(userId, newRole);
    if (res.ok) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success(`Role updated to ${newRole}`);
    } else {
      toast.error(res.error);
    }
  };

  const handleStatusToggle = async (user: UserData) => {
    const isDeleting = !user.deletedAt;
    const res = await toggleUserStatusAction(user.id, isDeleting);
    if (res.ok) {
      setUsers(users.map(u => u.id === user.id ? { ...u, deletedAt: isDeleting ? new Date() : null } : u));
      toast.success(`User ${isDeleting ? "disabled" : "enabled"} successfully`);
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Generations</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="font-medium">{user.name || "Unknown"}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.deletedAt ? "destructive" : "outline"}>
                    {user.deletedAt ? "Disabled" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(user.createdAt), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">{user._count.generationHistory.toLocaleString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {user.role === "USER" ? (
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, "ADMIN")}>
                          <ShieldAlert className="mr-2 h-4 w-4" /> Make Admin
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, "USER")}>
                          <Shield className="mr-2 h-4 w-4" /> Remove Admin
                        </DropdownMenuItem>
                      )}
                      
                      {user.deletedAt ? (
                        <DropdownMenuItem onClick={() => handleStatusToggle(user)}>
                          <UserCheck className="mr-2 h-4 w-4" /> Enable User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleStatusToggle(user)} className="text-destructive focus:bg-destructive/10">
                          <UserX className="mr-2 h-4 w-4" /> Disable User
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
