import { Button, Typography } from "@mui/material";
import Toast from "../../utils/Toast";
import { useLayoutEffect, useRef, useState } from "react";
import FormikForm, { Checkbox, DateTimePicker, FileInput, FirmPad, Input, Radio, Select2, Switch, Textarea } from "../../components/forms";
import * as Yup from "yup";
import { useGlobalContext } from "../../context/GlobalContext";
import ClockComponent from "./../../components/ClockComponent";
import { DataTableComponent } from "../../components";
import { useNavigate } from "react-router-dom";

const Index = ({}) => {
   const navigate = useNavigate();
   const { setIsLoading } = useGlobalContext();

   const [counter, setCounter] = useState(0);
   const handleClick = () => {
      Toast.Success("Success: " + counter);
      Toast.Error("Error: " + counter);
      Toast.Warning("Warning: " + counter);
      Toast.Info("Info: " + counter);
      Toast.Default("Default: " + counter);
      setCounter(counter + 1);
      navigate("/app/configuraciones/usuarios");
   };

   useLayoutEffect(() => {
      setIsLoading(false);
   }, []);

   return (
      <>
         <Typography>Hola mundo</Typography>
         <ClockComponent color={"initial"} />
         <Button onClick={handleClick}>Click</Button>
      </>
   );
};

export default Index;
