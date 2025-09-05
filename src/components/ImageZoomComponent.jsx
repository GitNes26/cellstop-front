import { Typography } from "@mui/material";
import { useState } from "react";
import env from "../constant/env";

const ImageZoomComponent = ({ imgUrl, imgName, left = null, bgTransparent = false }) => {
   const [ttShow, setTtShow] = useState("");

   const handleMouseEnter = () => {
      setTtShow("tt_show");
   };
   const handleMouseLeave = () => {
      setTtShow("");
   };

   return (
      <aside className={`file-preview`} style={{ paddingBlock: 2, marginBottom: 10, backgroundColor: bgTransparent && "transparent" }}>
         <div /* key={imgName} */ className={"preview-item"}>
            {/* {imgName.includes(".pdf") || imgName.includes(".PDF") ? ( */}
            <Typography textAlign={"center"} fontWeight={"bolder"} variant="h5">
               {imgName}
            </Typography>
            <>
               <img
                  className="img-zoom"
                  src={`${env.API_URL_IMG}/${imgUrl}`}
                  style={{ width: "50%", borderRadius: 15 }}
                  alt={imgName}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
               />
               {imgUrl !== undefined && (
                  <img
                     width={"50%"}
                     src={`${env.API_URL_IMG}/${imgUrl}`}
                     alt={imgName}
                     srcSet=""
                     className={`tooltip_imagen ${ttShow}`}
                     style={{ left: left }}
                     onMouseEnter={handleMouseEnter}
                     onMouseLeave={handleMouseLeave}
                  />
               )}
            </>
            {/* <>
                              <embed
                                 className={"preview-pdf"}
                                 src={preview.dataURL}
                                 type="application/pdf"
                                 width="100%"
                                 height="500px"
                                 onMouseEnter={handleMouseEnter}
                                 onMouseLeave={handleMouseLeave}
                              />
                              {imgName !== "undefined" && (
                                 <embed
                                    className={`tooltip_imagen ${ttShow}`}
                                    src={preview.dataURL}
                                    type="application/pdf"
                                    width="50%"
                                    height="80%"
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                 />
                              )}
                              <div
                                 className={"remove-pdf-button"}
                                 onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveImage(preview.file);
                                 }}
                                 aria-disabled={disabled}
                              >
                                 {!disabled && "Eliminar"}
                              </div>
                           </>
                        ) : (
                         
                        )} */}
         </div>
      </aside>
   );
};

export default ImageZoomComponent;
