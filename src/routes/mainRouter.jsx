import { lazy } from "react";

import ProtectedRouter from "../components/ProtectedRouter"; //const ProtectedRouter = lazy(() => import("../components/ProtectedRouter"));
// import MainLayout from "../layouts/MainLayout";
const MainLayout = lazy(() => import("../layouts/MainLayout"));
// import Index from "./../views/app/Index";
const Index = lazy(() => import("./../views/app/Index"));
// import SettingsView from "./../views/app/settings/settingsView/Index"; //const SettingsView = lazy(() => import("./../views/app/settings/settingsView/Index"));
const MenusView = lazy(() => import("./../views/app/settings/menusView/Index")); //import MenusView from "./../views/app/settings/menusView/Index";
const RolesView = lazy(() => import("./../views/app/settings/rolesView/Index")); //import RolesView from "./../views/app/settings/rolesView/Index";
const DepartmentsView = lazy(() => import("./../views/app/settings/departmentsView/Index")); //import DepartmentsView from "./../views/app/settings/departmentsView/Index";
const PositionsView = lazy(() => import("./../views/app/settings/positionsView/Index")); //import PositionsView from "./../views/app/settings/positionsView/Index";
const EmployeesView = lazy(() => import("./../views/app/settings/employeesView/Index")); //import EmployeesView from "./../views/app/settings/employeesView/Index";
const ChipsView = lazy(() => import("../views/app/catalogs/chipsView/Index")); //import ChipView from "./../views/app/settings/chipsView/Index";
const LotesView = lazy(() => import("../views/app/catalogs/lotesView/Index")); //import LoteView from "./../views/app/settings/lotesView/Index";

const UsersView = lazy(() => import("./../views/app/settings/usersView/Index")); //import UsersView from "./../views/app/settings/usersView/Index";
const NotFound = lazy(() => import("./../views/NotFound")); //import NotFound from "./../views/NotFound";

// import UsersView from "./../views/app/settings/usersView/Index";
import UserContextProvider from "../context/UserContext";
import RoleContextProvider from "../context/RoleContext";
import EmployeeContextProvider from "../context/EmployeeContext";
import PositionContextProvider from "../context/PositionContext";
import DepartmentContextProvider from "../context/DepartmentContext";
import MenuContextProvider from "../context/MenuContext";
// import ChipsView from "../views/app/catalogs/chipsView/Index";
import ChipContextProvider from "../context/ChipContext";
import LoteContextProvider from "../context/LoteContext";
// import MenusView from "./../views/app/settings/menusView/Index";

const mainRouter = {
   path: "/app",
   element: (
      <ProtectedRouter redirectTo={"/"}>
         <MainLayout />
      </ProtectedRouter>
   ),
   errorElement: <NotFound />,
   children: [
      {
         index: true,
         path: "",
         element: (
            // <RegisterContextProvider>
            //    <DepartmentContextProvider>
            //       <CategoryContextProvider>
            //          <SubcategoryContextProvider>
            //             <SituationContextProvider>
            //                <RoleContextProvider>
            <Index />
            //                </RoleContextProvider>
            //             </SituationContextProvider>
            //          </SubcategoryContextProvider>
            //       </CategoryContextProvider>
            //    </DepartmentContextProvider>
            // </RegisterContextProvider>
         )
      },
      {
         path: "configuraciones",
         children: [
            {
               path: "menus",
               element: (
                  <MenuContextProvider>
                     <MenusView />
                  </MenuContextProvider>
               )
            },
            {
               path: "roles-y-permisos",
               element: (
                  <RoleContextProvider>
                     <MenuContextProvider>
                        <RolesView />
                     </MenuContextProvider>
                  </RoleContextProvider>
               )
            },
            {
               path: "departamentos",
               element: (
                  <DepartmentContextProvider>
                     <DepartmentsView />
                  </DepartmentContextProvider>
               )
            },
            {
               path: "puestos",
               element: (
                  <PositionContextProvider>
                     <DepartmentContextProvider>
                        <PositionsView />
                     </DepartmentContextProvider>
                  </PositionContextProvider>
               )
            },
            {
               path: "empleados",
               element: (
                  <EmployeeContextProvider>
                     <DepartmentContextProvider>
                        <PositionContextProvider>
                           <EmployeesView />
                        </PositionContextProvider>
                     </DepartmentContextProvider>
                  </EmployeeContextProvider>
               )
            },
            {
               path: "usuarios",
               element: (
                  <UserContextProvider>
                     <RoleContextProvider>
                        <DepartmentContextProvider>
                           <EmployeeContextProvider>
                              <PositionContextProvider>
                                 <UsersView />
                              </PositionContextProvider>
                           </EmployeeContextProvider>
                        </DepartmentContextProvider>
                     </RoleContextProvider>
                  </UserContextProvider>
               )
            }
         ]
      },
      {
         path: "catalogos",
         children: [
            {
               path: "chips",
               element: (
                  <ChipContextProvider>
                     <LoteContextProvider>
                        <ChipsView />
                     </LoteContextProvider>
                  </ChipContextProvider>
               )
            },
            {
               path: "lotes",
               element: (
                  <LoteContextProvider>
                     <UserContextProvider>
                        <RoleContextProvider>
                           <EmployeeContextProvider>
                              <DepartmentContextProvider>
                                 <PositionContextProvider>
                                    <LotesView />
                                 </PositionContextProvider>
                              </DepartmentContextProvider>
                           </EmployeeContextProvider>
                        </RoleContextProvider>
                     </UserContextProvider>
                  </LoteContextProvider>
               )
            }
         ]
      }
   ]
};
export default mainRouter;
