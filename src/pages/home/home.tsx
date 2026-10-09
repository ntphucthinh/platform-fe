import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { HeaderTitle } from '@/components/ui/header/headerTitle';

export function Home() {
  const stats = [
    { title: 'Total Users', value: '1,284', change: '+12%', icon: <PeopleIcon color="primary" /> },
    { title: 'Products', value: '432', change: '+5%', icon: <InventoryIcon color="success" /> },
    { title: 'Orders', value: '892', change: '+18%', icon: <ShoppingCartIcon color="warning" /> },
    { title: 'Revenue', value: '$45,210', change: '+24%', icon: <TrendingUpIcon color="info" /> },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <HeaderTitle>Dashboard</HeaderTitle>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
          Welcome back, Admin
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here is an overview of your platform statistics.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid key={index} sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
            <Card elevation={1}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {stat.title}
                  </Typography>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'action.hover' }}>
                    {stat.icon}
                  </Box>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                  {stat.change} vs last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card elevation={1} sx={{ p: 3, mt: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
          System Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Core UI initialization complete. All foundation components (Login, Admin Layout, Header, Sidebar, Responsive Drawer) are ready for feature integration.
        </Typography>
      </Card>
    </Box>
  );
}

export default Home;
