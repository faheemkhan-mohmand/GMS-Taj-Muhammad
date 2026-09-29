import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Trash2, Loader2, Users } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

function UserAvatar({ imgUrl, fullName }: { imgUrl: string | null; fullName: string }) {
  const [imgError, setImgError] = useState(false);
  return imgUrl && !imgError ? (
    <img src={imgUrl} alt={`${fullName}'s avatar`} className="w-8 h-8 rounded-full object-cover shrink-0" onError={() => setImgError(true)} loading="lazy" decoding="async" />
  ) : (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
      {fullName.charAt(0).toUpperCase()}
    </div>
  );
}

interface AdminProfile {
  id: string;
  full_name: string | null;
  role: "admin";
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface AdminUserForm {
  full_name: string;
  email: string;
  password: string;
  phone: string;
}

const EMPTY_FORM: AdminUserForm = { full_name: "", email: "", password: "", phone: "" };

async function callAdminUsersApi(payload: Record<string, unknown>) {
  const { data, error } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (error || !token) throw new Error("Your session expired — please sign in again.");

  const response = await fetch("/api/admin-create-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.error || "The server could not complete this request.");
  return result;
}

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<AdminUserForm>(EMPTY_FORM);
  const [adding, setAdding] = useState(false);

  // This page is intentionally only for administrators. Students and teachers
  // are managed in their own areas and never appear in this account list.
  const { data: admins = [], isLoading } = useQuery<AdminProfile[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, role, phone, avatar_url, created_at")
        .eq("role", "admin")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as AdminProfile[];
    },
  });

  const deleteAdmin = useMutation({
    mutationFn: (id: string) => callAdminUsersApi({ action: "delete", id }),
    onSuccess: () => {
      toast.success("Admin account deleted.");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
    },
    onError: (error: Error) => toast.error(`Delete failed: ${error.message}`, { duration: 6000 }),
  });

  const filtered = admins.filter((admin) => {
    const term = search.trim().toLowerCase();
    return !term || admin.full_name?.toLowerCase().includes(term) || admin.phone?.includes(term);
  });

  const handleAddAdmin = async () => {
    const fullName = addForm.full_name.trim();
    const email = addForm.email.trim();
    if (!fullName || !email || !addForm.password) {
      toast.error("Name, email, and password are required.");
      return;
    }
    if (addForm.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setAdding(true);
    try {
      await callAdminUsersApi({
        action: "create",
        full_name: fullName,
        email,
        password: addForm.password,
        phone: addForm.phone.trim(),
      });
      toast.success(`Admin account created for ${email}.`);
      setAddForm(EMPTY_FORM);
      setAddOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create the admin account.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" /> User Management
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage administrator accounts. Students and teachers are managed separately.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Admin
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
              {admins.length}
            </div>
            <span className="text-sm font-medium text-muted-foreground">Administrators</span>
          </CardContent>
        </Card>
      </div>

      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search admin name or phone..."
          className="pl-9"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">{[...Array(4)].map((_, index) => <Skeleton key={index} className="h-14 rounded-lg" />)}</div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-14 text-center">
          <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-semibold text-foreground">No administrators found</p>
          <p className="text-sm text-muted-foreground mt-1">Try another search or add an administrator.</p>
        </CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Administrator</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filtered.map((admin) => {
                  const isSelf = admin.id === user?.id;
                  const createdAt = new Date(admin.created_at);
                  return <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <UserAvatar imgUrl={admin.avatar_url} fullName={admin.full_name || "Admin"} />
                        <p className="font-medium text-sm text-foreground">
                          {admin.full_name || "—"}
                          {isSelf && <Badge variant="secondary" className="ml-2 text-[10px] py-0">You</Badge>}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell><Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Admin</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{admin.phone || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {Number.isNaN(createdAt.getTime()) ? "—" : format(createdAt, "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      {!isSelf && <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10" disabled={deleteAdmin.isPending}>
                            {deleteAdmin.isPending && deleteAdmin.variables === admin.id
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : <Trash2 className="w-4 h-4" />}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove {admin.full_name || "this administrator"}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This permanently deletes the administrator's login and profile. They will no longer be able to sign in.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteAdmin.mutate(admin.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Remove Admin
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>}
                    </TableCell>
                  </TableRow>;
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground">Showing {filtered.length} of {admins.length} administrators</p>

      <Dialog open={addOpen} onOpenChange={(open) => { setAddOpen(open); if (!open) setAddForm(EMPTY_FORM); }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add New Admin</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label htmlFor="admin-full-name">Full Name *</Label>
              <Input id="admin-full-name" value={addForm.full_name} onChange={(event) => setAddForm((prev) => ({ ...prev, full_name: event.target.value }))} placeholder="Administrator name" />
            </div>
            <div><Label htmlFor="admin-email">Email *</Label>
              <Input id="admin-email" type="email" value={addForm.email} onChange={(event) => setAddForm((prev) => ({ ...prev, email: event.target.value }))} placeholder="admin@example.com" />
            </div>
            <div><Label htmlFor="admin-password">Password * (min 6 characters)</Label>
              <Input id="admin-password" type="password" autoComplete="new-password" value={addForm.password} onChange={(event) => setAddForm((prev) => ({ ...prev, password: event.target.value }))} placeholder="••••••••" />
            </div>
            <div><Label htmlFor="admin-phone">Phone (optional)</Label>
              <Input id="admin-phone" value={addForm.phone} onChange={(event) => setAddForm((prev) => ({ ...prev, phone: event.target.value }))} placeholder="0300-0000000" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} disabled={adding}>Cancel</Button>
            <Button onClick={handleAddAdmin} disabled={adding} className="gap-2">
              {adding && <Loader2 className="w-4 h-4 animate-spin" />}
              {adding ? "Adding..." : "Add Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
