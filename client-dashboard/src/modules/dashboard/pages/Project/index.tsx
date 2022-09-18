import { ROUTE_PATH } from 'enums';
import { Navigate, Outlet, Route, Routes } from 'react-router';
import Home from './Home';

const Project = () => {
  const routePath = ROUTE_PATH.DASHBOARD_PATHS.PROJECT;
  const subRoute = (route: string) => route.replace(routePath.HOME, '');

  return (
    <Routes>
      <Route path={'/'} element={<Home />} />

      <Route
        path={subRoute(routePath.MICROBIOME_DONOR_PROGRAMME.HOME)}
        element={<Home />}
      />
      <Route
        path={subRoute(routePath.MICROBIOME_DONOR_PROGRAMME.ADD_NEW_SURVEY)}
        element={<Home />}
      />
      <Route
        path={subRoute(routePath.MICROBIOME_DONOR_PROGRAMME.SURVEY_LIST)}
        element={<Home />}
      />

      <Route path={subRoute(routePath.NCCS_ELEGANCE.HOME)} element={<Home />} />
      <Route
        path={subRoute(routePath.NCCS_ELEGANCE.ADD_NEW_SURVEY)}
        element={<Home />}
      />
      <Route
        path={subRoute(routePath.NCCS_ELEGANCE.SURVEY_LIST)}
        element={<Home />}
      />

      <Route
        path={subRoute(routePath.AMILI_MONASH_GUT_MICROBIOME.HOME)}
        element={<Home />}
      />
      <Route
        path={subRoute(routePath.AMILI_MONASH_GUT_MICROBIOME.ADD_NEW_SURVEY)}
        element={<Home />}
      />
      <Route
        path={subRoute(routePath.AMILI_MONASH_GUT_MICROBIOME.SURVEY_LIST)}
        element={<Home />}
      />

      <Route path={subRoute(routePath.COLON_T2.HOME)} element={<Home />} />
      <Route
        path={subRoute(routePath.COLON_T2.ADD_NEW_SURVEY)}
        element={<Home />}
      />
      <Route
        path={subRoute(routePath.COLON_T2.SURVEY_LIST)}
        element={<Home />}
      />

      <Route path="*" element={<Navigate to={ROUTE_PATH.HOME} />} />
    </Routes>
  );
};

export default Project;
