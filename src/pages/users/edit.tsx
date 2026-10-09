import { Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import { UserForm } from "@/components/pages/users/userForm";
import { MOCK_USERS, UserRole, UserStatus } from "@/constants/userConstant";
import type { IUserFormData } from "@/types/pages/users/user";

export function UsersEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const userId = Number(id);
  const existingUser = MOCK_USERS.find((user) => user.id === userId);

  const defaultValues: Partial<IUserFormData> = {
    name: existingUser?.name || "",
    email: existingUser?.email || "",
    role: existingUser?.role || UserRole.User,
    status: existingUser?.status || UserStatus.Active,
  };

  const handleSubmit = (data: IUserFormData) => {
    console.log("User edit form submitted for ID:", id, data);
    navigate("/users/list");
  };

  const handleCancel = () => {
    navigate("/users/list");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <HeaderTitle>User Create/Edit</HeaderTitle>
      <UserForm
        mode="edit"
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </Box>
  );
}

export default UsersEdit;
