// components/dashboard/layouts/GridLayout.tsx
import React from "react";
import { Grid, GridProps, Box } from "@mui/material";
import { motion } from "framer-motion";

interface GridLayoutProps extends GridProps {
   children: React.ReactNode;
   animate?: boolean;
}

export const GridLayout: React.FC<GridLayoutProps> = ({ children, animate = true, ...gridProps }) => {
   const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: {
            staggerChildren: 0.1
         }
      }
   };

   const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
         y: 0,
         opacity: 1,
         transition: {
            type: "spring",
            stiffness: 100
         }
      }
   };

   if (!animate) {
      return (
         <Grid container {...gridProps}>
            {children}
         </Grid>
      );
   }

   return (
      <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
         <Grid container {...gridProps}>
            {React.Children.map(children, (child, index) => (
               <motion.div variants={itemVariants} style={{ width: "100%" }}>
                  {child}
               </motion.div>
            ))}
         </Grid>
      </Box>
   );
};
