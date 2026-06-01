"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toggleTemplateStatusAction, deleteTemplateAction } from "@/features/admin/server/manage-templates";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Power, PowerOff, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

type TemplateData = {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
  owner: { name: string | null; email: string };
  _count: { generationHistory: number };
};

export function AdminTemplatesClient({ initialTemplates }: { initialTemplates: TemplateData[] }) {
  const [templates, setTemplates] = useState<TemplateData[]>(initialTemplates);

  const handleStatusToggle = async (id: string, newStatus: "PUBLISHED" | "ARCHIVED") => {
    const res = await toggleTemplateStatusAction(id, newStatus);
    if (res.ok) {
      setTemplates(templates.map(t => t.id === id ? { ...t, status: newStatus } : t));
      toast.success(`Template ${newStatus.toLowerCase()}`);
    } else {
      toast.error(res.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    
    const res = await deleteTemplateAction(id);
    if (res.ok) {
      setTemplates(templates.filter(t => t.id !== id));
      toast.success("Template deleted");
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Template
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Template</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Uses</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No templates found.
                </TableCell>
              </TableRow>
            ) : (
              templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.title}</TableCell>
                  <TableCell>
                    <Badge variant={template.status === "PUBLISHED" ? "default" : "secondary"}>
                      {template.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{template.owner.name || "Unknown"}</div>
                    <div className="text-xs text-muted-foreground">{template.owner.email}</div>
                  </TableCell>
                  <TableCell>{format(new Date(template.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">{template._count.generationHistory.toLocaleString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {template.status === "PUBLISHED" ? (
                          <DropdownMenuItem onClick={() => handleStatusToggle(template.id, "ARCHIVED")}>
                            <PowerOff className="mr-2 h-4 w-4" /> Disable
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleStatusToggle(template.id, "PUBLISHED")}>
                            <Power className="mr-2 h-4 w-4" /> Enable
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDelete(template.id)} className="text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
