import { DialogComponent, Typography } from "../../../../components/basics";
import ReceiptForm from "./Form";
import { useCallback, useEffect } from "react";
import ReceiptDT from "./DataTable";
import useFetch from "../../../../hooks/useFetch";
import { useGlobalContext } from "../../../../context/GlobalContext";
import { useReceiptContext } from "../../../../context/ReceiptContext";
import ReceiptInfoCard from "./InfoCard";

const ReceiptsView = ({}) => {
   const { openDialog, setOpenDialog, openDialogRegister, setOpenDialogRegister } = useGlobalContext();
   const { pluralName, receipt, allReceipts, setAllReceipts, getAllReceipts } = useReceiptContext();

   useFetch(getAllReceipts, setAllReceipts);

   useEffect(() => {
      // console.log("🚀 Index ~ useEffect ~ allReceipts:", allReceipts);
      // (async () => {
      //    await handleGetHeadersReceipts();
      //    await handleGetAllReceipts();
      // })();
   }, [allReceipts]);

   return (
      <>
         <Typography variant="h2" fontWeight={400} className="mb-2 text-center">
            {pluralName.toUpperCase()}
         </Typography>
         <ReceiptDT />
         <ReceiptForm openDialog={openDialog} setOpenDialog={setOpenDialog} />
         {openDialogRegister && (
            <DialogComponent open={openDialogRegister} setOpen={setOpenDialogRegister} btnPrint>
               <ReceiptInfoCard data={receipt} />
            </DialogComponent>
         )}
      </>
   );
};

export default ReceiptsView;
