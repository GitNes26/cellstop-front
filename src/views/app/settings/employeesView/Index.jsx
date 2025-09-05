import { useEffect } from "react";
import EmployeeDT from "./DataTable";
import EmployeeForm from "./Form";
import useFetch from "../../../../hooks/useFetch";
import { useEmployeeContext } from "../../../../context/EmployeeContext";
import { Typography } from "@mui/material";
import { useGlobalContext } from "../../../../context/GlobalContext";

const EmployeesView = ({}) => {
   const { openDialog, setOpenDialog } = useGlobalContext();
   const { pluralName, allEmployees, setAllEmployees, getAllEmployees } = useEmployeeContext();

   // CARGA DE LISTADOS
   useFetch(getAllEmployees, setAllEmployees);

   useEffect(() => {}, [allEmployees]);

   return (
      <>
         <Typography variant="h2" fontWeight={400} className="mb-2 text-center">
            {pluralName.toUpperCase()}
         </Typography>
         <EmployeeDT />
         <EmployeeForm container={"drawer"} refreshSelect={getAllEmployees} openDialog={openDialog} setOpenDialog={setOpenDialog} />
      </>
   );
};

export default EmployeesView;
