import { Divider, SxProps, Typography } from "@mui/material";

interface DividerComponentProps {
   title: string;
   orientation?: "horizontal" | "vertical";
   sx?: SxProps;
}

const DividerComponent = ({ title, orientation = "horizontal", sx }: DividerComponentProps) => {
   return (
      <>
         <Divider orientation={orientation} sx={{ width: "95%", justifyContent: "center", margin: "1rem auto", ...sx }}>
            <Typography variant="body2" fontWeight="bold">
               {title}
            </Typography>
         </Divider>
      </>
   );
};

export default DividerComponent;
