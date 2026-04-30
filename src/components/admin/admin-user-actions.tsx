import { ButtonGroup } from "@/components/ui/button-group";
import { DeleteUserDialog } from "@/components/admin/delete-user-dialog";
import { EditUserDialog } from "@/components/admin/edit-user-dialog";
import type { UserListItem } from "@/lib/db/users";

export function AdminUserActions({
  user,
  currentUserId,
}: {
  user: UserListItem;
  currentUserId: string;
}) {
  return (
    <ButtonGroup aria-label="User actions">
      <EditUserDialog user={user} />
      <DeleteUserDialog user={user} isCurrentUser={user.id === currentUserId} />
    </ButtonGroup>
  );
}
