import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { HeaderTitle } from '@/components/ui/header/headerTitle';
import { UserForm } from '@/components/pages/users/userForm';
import type { IUserFormData } from '@/types/pages/users/user';

export function UsersCreate() {
  const navigate = useNavigate();

  const handleSubmit = (data: IUserFormData) => {
    console.log('User create form submitted:', data);
    navigate('/users/list');
  };

  const handleCancel = () => {
    navigate('/users/list');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <HeaderTitle>User Create/Edit</HeaderTitle>
      <UserForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </Box>
  );
}

export default UsersCreate;
