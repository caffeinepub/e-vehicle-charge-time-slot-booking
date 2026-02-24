import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Layout } from './components/Layout';
import { StationsPage } from './pages/StationsPage';
import { BookingPage } from './pages/BookingPage';
import { DashboardPage } from './pages/DashboardPage';
import { BookingSuccessPage } from './pages/BookingSuccessPage';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: StationsPage,
});

const bookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/booking/$stationId',
  component: BookingPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const successRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/booking-success/$bookingId',
  component: BookingSuccessPage,
});

const routeTree = rootRoute.addChildren([indexRoute, bookingRoute, dashboardRoute, successRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
