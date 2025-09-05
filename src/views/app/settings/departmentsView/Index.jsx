import DepartmentForm from "./Form";
import { useEffect } from "react";
import DepartmentDT from "./DataTable";
import useFetch from "../../../../hooks/useFetch";
import { useDepartmentContext } from "../../../../context/DepartmentContext";
import { Typography } from "@mui/material";
import { useGlobalContext } from "../../../../context/GlobalContext";

const DepartmentsView = ({}) => {
   const { openDialog, setOpenDialog } = useGlobalContext();
   const { pluralName, allDepartments, setAllDepartments, getAllDepartments } = useDepartmentContext();

   // CARGA DE LISTADOS
   useFetch(getAllDepartments, setAllDepartments);

   useEffect(() => {}, [allDepartments]);

   return (
      <>
         <Typography variant="h2" fontWeight={400} className="mb-2 text-center">
            {pluralName.toUpperCase()}
         </Typography>
         <DepartmentDT />
         <DepartmentForm container={"drawer"} refreshSelect={getAllDepartments} openDialog={openDialog} setOpenDialog={setOpenDialog} />
      </>
   );
};

export default DepartmentsView;
