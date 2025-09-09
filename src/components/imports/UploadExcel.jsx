// src/components/imports/UploadExcel.tsx
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { Button, Card } from "@mui/material";
import api from "../../api";

export default function UploadExcel({ fileType = "imp" }) {
   const [preview, setPreview] = useState(null);
   const [file, setFile] = useState(null);
   const onDrop = (accepted) => {
      const f = accepted[0];
      setFile(f);
      const reader = new FileReader();
      reader.onload = (e) => {
         const data = new Uint8Array(e.target.result);
         const wb = XLSX.read(data, { type: "array" });
         const sheetName = wb.SheetNames[0];
         const ws = wb.Sheets[sheetName];
         const json = XLSX.utils.sheet_to_json(ws, { header: 1 });
         // convert to objects using header row
         const header = json[0] || [];
         const rows = json.slice(1, 51).map((r) => {
            const obj = {};
            header.forEach((h, i) => (obj[h] = r[i]));
            return obj;
         });
         setPreview({ header, rows });
      };
      reader.readAsArrayBuffer(f);
   };

   const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx", ".xls"] } });

   async function handleUpload() {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("file_type", fileType);
      const res = await api.post("/imports", fd, { headers: { "Content-Type": "multipart/form-data" } });
      // show toast and/or navigate to imports list
   }

   return (
      <Card className="p-4">
         <div {...getRootProps()} className="border-dashed border-2 p-6 text-center cursor-pointer">
            <input {...getInputProps()} />
            <p>Drag & drop Excel here, or click to select</p>
         </div>

         {preview && (
            <div className="mt-4">
               <h4 className="font-medium">Preview</h4>
               <div className="overflow-auto max-h-64">
                  <table className="min-w-full text-sm">
                     <thead>
                        <tr>
                           {preview.header.map((h) => (
                              <th key={h} className="px-2">
                                 {h}
                              </th>
                           ))}
                        </tr>
                     </thead>
                     <tbody>
                        {preview.rows.map((r, idx) => (
                           <tr key={idx}>
                              {preview.header.map((h) => (
                                 <td key={h} className="px-2">
                                    {r[h]}
                                 </td>
                              ))}
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               <div className="flex justify-end mt-2">
                  <Button variant="contained" onClick={handleUpload}>
                     Upload
                  </Button>
               </div>
            </div>
         )}
      </Card>
   );
}
