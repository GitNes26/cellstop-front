import { lazy } from "react";

import ProtectedRouter from "../components/ProtectedRouter"; //const ProtectedRouter = lazy(() => import("../components/ProtectedRouter"));
// import MainLayout from "../layouts/MainLayout";
const MainLayout = lazy(() => import("../layouts/MainLayout"));
// import Index from "./../views/app/Index";
const Index = lazy(() => import("../views/app/Index"));
const DashboardView = lazy(() => import("../views/app/main/dashboard/Index"));
const ReporterView = lazy(() => import("../views/app/main/reporter/Index"));
// import SettingsView from "./../views/app/settings/settingsView/Index"; //const SettingsView = lazy(() => import("./../views/app/settings/settingsView/Index"));
const MenusView = lazy(() => import("../views/app/settings/menusView/Index")); //import MenusView from "./../views/app/settings/menusView/Index";
const RolesView = lazy(() => import("../views/app/settings/rolesView/Index")); //import RolesView from "./../views/app/settings/rolesView/Index";
const DepartmentsView = lazy(() => import("../views/app/settings/departmentsView/Index")); //import DepartmentsView from "./../views/app/settings/departmentsView/Index";
const PositionsView = lazy(() => import("../views/app/settings/positionsView/Index")); //import PositionsView from "./../views/app/settings/positionsView/Index";
const EmployeesView = lazy(() => import("../views/app/settings/employeesView/Index")); //import EmployeesView from "./../views/app/settings/employeesView/Index";
const ProductTypesView = lazy(() => import("../views/app/catalogs/productTypesView/Index")); //import ProductTypesView from "./../views/app/settings/productTypesView/Index";
const ProductsView = lazy(() => import("../views/app/productFlow/productsView/Index")); //import ProductView from "./../views/app/settings/productsView/Index";
const LotesView = lazy(() => import("../views/app/catalogs/lotesView/Index")); //import LoteView from "./../views/app/settings/lotesView/Index";
const PointsOfSaleView = lazy(() => import("../views/app/catalogs/pointsOfSaleView/Index"));
const SalesView = lazy(() => import("../views/app/catalogs/salesView/Index"));

const TemplateEditorView = lazy(() => import("../views/app/others/templateEditorView/Index"));

const UsersView = lazy(() => import("../views/app/settings/usersView/Index")); //import UsersView from "./../views/app/settings/usersView/Index";
const NotFound = lazy(() => import("../views/NotFound")); //import NotFound from "./../views/NotFound";

// import UsersView from "./../views/app/settings/usersView/Index";
import UserContextProvider from "../context/UserContext";
import RoleContextProvider from "../context/RoleContext";
import EmployeeContextProvider from "../context/EmployeeContext";
import PositionContextProvider from "../context/PositionContext";
import DepartmentContextProvider from "../context/DepartmentContext";
import MenuContextProvider from "../context/MenuContext";
// import ProductsView from "../views/app/catalogs/productsView/Index";
import ProductContextProvider from "../context/ProductContext";
import LoteContextProvider from "../context/LoteContext";
import PointOfSaleContextProvider from "../context/PointOfSaleContext";
import SaleContextProvider from "../context/SaleContext";
import ProductTypeContextProvider from "../context/ProductTypeContext";
import VisitContextProvider from "../context/VisitContext";
import VisitsView from "../views/app/others/visitsView/Index";
import DashboardContextProvider from "../context/DashboardContext";
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
         path: "tablero",
         element: (
            <UserContextProvider>
               <ProductContextProvider>
                  <ProductTypeContextProvider>
                     <RoleContextProvider>
                        <EmployeeContextProvider>
                           <DepartmentContextProvider>
                              <PositionContextProvider>
                                 <LoteContextProvider>
                                    <PointOfSaleContextProvider>
                                       <VisitContextProvider>
                                          <DashboardView />
                                       </VisitContextProvider>
                                    </PointOfSaleContextProvider>
                                 </LoteContextProvider>
                              </PositionContextProvider>
                           </DepartmentContextProvider>
                        </EmployeeContextProvider>
                     </RoleContextProvider>
                  </ProductTypeContextProvider>
               </ProductContextProvider>
            </UserContextProvider>
         )
      },
      {
         path: "reporteador",
         element: (
            // <RegisterContextProvider>
            //    <DepartmentContextProvider>
            //       <CategoryContextProvider>
            //          <SubcategoryContextProvider>
            //             <SituationContextProvider>
            //                <RoleContextProvider>
            <DashboardContextProvider>
               <ReporterView />
            </DashboardContextProvider>
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
               path: "tipos-de-producto",
               element: (
                  <ProductTypeContextProvider>
                     <ProductTypesView />
                  </ProductTypeContextProvider>
               )
            },
            {
               path: "lotes",
               element: (
                  <UserContextProvider>
                     <ProductContextProvider>
                        <LoteContextProvider>
                           <RoleContextProvider>
                              <EmployeeContextProvider>
                                 <DepartmentContextProvider>
                                    <PositionContextProvider>
                                       <LotesView />
                                    </PositionContextProvider>
                                 </DepartmentContextProvider>
                              </EmployeeContextProvider>
                           </RoleContextProvider>
                        </LoteContextProvider>
                     </ProductContextProvider>
                  </UserContextProvider>
               )
            },
            {
               path: "puntos-de-venta",
               element: (
                  <UserContextProvider>
                     <RoleContextProvider>
                        <EmployeeContextProvider>
                           <DepartmentContextProvider>
                              <PositionContextProvider>
                                 <PointOfSaleContextProvider>
                                    <PointsOfSaleView />
                                 </PointOfSaleContextProvider>
                              </PositionContextProvider>
                           </DepartmentContextProvider>
                        </EmployeeContextProvider>
                     </RoleContextProvider>
                  </UserContextProvider>
               )
            },
            {
               path: "ventas",
               element: (
                  <SaleContextProvider>
                     <SalesView />
                  </SaleContextProvider>
               )
            }
         ]
      },
      {
         path: "productos",
         children: [
            {
               index: true,
               path: ":status?",
               element: (
                  <UserContextProvider>
                     <ProductContextProvider>
                        <ProductTypeContextProvider>
                           <RoleContextProvider>
                              <EmployeeContextProvider>
                                 <DepartmentContextProvider>
                                    <PositionContextProvider>
                                       <LoteContextProvider>
                                          <ProductsView />
                                       </LoteContextProvider>
                                    </PositionContextProvider>
                                 </DepartmentContextProvider>
                              </EmployeeContextProvider>
                           </RoleContextProvider>
                        </ProductTypeContextProvider>
                     </ProductContextProvider>
                  </UserContextProvider>
               )
            }
         ]
      },
      {
         path: "otros",
         children: [
            {
               path: "editor-de-plantilla",
               element: (
                  // <ProductTypeContextProvider>
                  <TemplateEditorView />
                  // </ProductTypeContextProvider>
               )
            },
            {
               path: "visitas",
               element: (
                  <UserContextProvider>
                     <ProductContextProvider>
                        <ProductTypeContextProvider>
                           <RoleContextProvider>
                              <EmployeeContextProvider>
                                 <DepartmentContextProvider>
                                    <PositionContextProvider>
                                       <LoteContextProvider>
                                          <PointOfSaleContextProvider>
                                             <VisitContextProvider>
                                                <VisitsView />
                                             </VisitContextProvider>
                                          </PointOfSaleContextProvider>
                                       </LoteContextProvider>
                                    </PositionContextProvider>
                                 </DepartmentContextProvider>
                              </EmployeeContextProvider>
                           </RoleContextProvider>
                        </ProductTypeContextProvider>
                     </ProductContextProvider>
                  </UserContextProvider>
               )
            }
         ]
      }
   ]
};
export default mainRouter;
