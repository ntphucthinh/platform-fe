import { Navigate } from 'react-router-dom';

export function UsersSetting() {
  return <Navigate to="/users/list" replace />;
}

export default UsersSetting;
