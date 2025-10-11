import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { IoIosClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { createTw } from "react-pdf-tailwind";

interface PhotoZoomProps {
  src: string;
  alt: string;
  description?: string;
  title?: string;
  className?:string
}
const tw = createTw({});

const PhotoZoom: React.FC<PhotoZoomProps> = ({ src, alt, description, title,className='max-w-screen-lg max-h-screen'}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const toggleZoom = () => setIsZoomed((prev) => !prev);
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(false);
  };

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomed(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Bloquear scroll cuando está abierto
  useEffect(() => {
    if (isZoomed) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isZoomed]);

  return (
    <div className="relative inline-block cursor-zoom-in">
      <img
        src={src}
        alt={alt}
        className="rounded-lg shadow-md transition-transform transform hover:scale-105"
        onClick={toggleZoom}
      />
      {description && (
        <p className="mt-2 text-sm text-gray-600 text-center">{description}</p>
      )}

      {ReactDOM.createPortal(
        <AnimatePresence>
          {isZoomed && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[5000] backdrop-blur-sm"
              onClick={toggleZoom}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative flex flex-col items-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                onClick={(e) => e.stopPropagation()} // evita cerrar al hacer clic en la imagen
              >
                {/* Botón cerrar */}
                <button
                  onClick={handleClose}
                  className="absolute -top-12 right-0 p-2 bg-white rounded-full shadow-lg transition-transform hover:scale-110 hover:bg-gray-200 focus:outline-none"
                >
                  <IoIosClose size={32} className="text-black" />
                </button>

                {/* Título */}
                {title && (
                  <h2 className="mb-4 text-white text-2xl font-semibold drop-shadow-lg text-center">
                    {title}
                  </h2>
                )}

                {/* Imagen */}
                <img
                  src={src}
                  alt={alt}
                  className={`rounded-lg shadow-2xl object-contain ${className}`}
                />

                {/* Descripción */}
                {description && (
                  <p className="mt-4 text-gray-200 text-sm text-center max-w-lg">
                    {description}
                  </p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default PhotoZoom;
