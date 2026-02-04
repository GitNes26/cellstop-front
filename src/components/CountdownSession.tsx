import React, { useState, useEffect, useCallback, useRef } from "react";
// import { X, AlertTriangle, CheckCircle, Clock, LogOut } from "lucide-react";
import { CheckCircleRounded, ClearRounded, LogoutRounded, ReportProblemRounded, WatchLaterRounded } from "@mui/icons-material";

interface CountdownSessionProps {
   startDate: Date;
   endDate: Date;
   title: string;
   description: string;
   onTimeout: () => void;
   onLogout: () => void;
   autoLogoutOnExpire?: boolean;
   showPersistentCounter?: boolean;
}

interface TimeRemaining {
   days: number;
   hours: number;
   minutes: number;
   seconds: number;
   totalSeconds: number;
}

const CountdownSession: React.FC<CountdownSessionProps> = ({
   startDate,
   endDate,
   title,
   description,
   onTimeout,
   onLogout,
   autoLogoutOnExpire = true,
   showPersistentCounter = true
}) => {
   const [showModal, setShowModal] = useState<boolean>(true);
   const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0
   });
   const [isExpired, setIsExpired] = useState<boolean>(false);
   const [isStarted, setIsStarted] = useState<boolean>(false);
   const [showWarning, setShowWarning] = useState<boolean>(false);
   const timeoutRef = useRef<NodeJS.Timeout | null>(null);
   const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

   const calculateTimeRemaining = useCallback((): TimeRemaining => {
      const now = new Date().getTime();
      const endTime = endDate.getTime();
      const startTime = startDate.getTime();

      // Si aún no ha comenzado
      if (now < startTime) {
         const diff = startTime - now;
         return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000),
            totalSeconds: Math.floor(diff / 1000)
         };
      }

      // Si ya comenzó
      const diff = endTime - now;
      if (diff <= 0) {
         return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            totalSeconds: 0
         };
      }

      return {
         days: Math.floor(diff / (1000 * 60 * 60 * 24)),
         hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
         minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
         seconds: Math.floor((diff % (1000 * 60)) / 1000),
         totalSeconds: Math.floor(diff / 1000)
      };
   }, [startDate, endDate]);

   const formatTime = (time: number): string => {
      return time.toString().padStart(2, "0");
   };

   const startCountdown = useCallback(() => {
      if (timeoutRef.current) {
         clearInterval(timeoutRef.current);
      }

      timeoutRef.current = setInterval(() => {
         const remaining = calculateTimeRemaining();
         const now = new Date().getTime();
         const startTime = startDate.getTime();

         // Verificar si ya comenzó
         if (now >= startTime && !isStarted) {
            setIsStarted(true);
         }

         // Verificar si expiró
         if (remaining.totalSeconds <= 0 && !isExpired) {
            setIsExpired(true);
            if (timeoutRef.current) {
               clearInterval(timeoutRef.current);
            }

            // Mostrar advertencia antes de ejecutar el timeout
            setShowWarning(true);

            // Ejecutar timeout después de 3 segundos de advertencia
            warningTimeoutRef.current = setTimeout(() => {
               if (autoLogoutOnExpire) {
                  onLogout();
               }
               onTimeout();
               setShowWarning(false);
            }, 3000);

            return;
         }

         // Mostrar advertencia cuando quedan 30 segundos
         if (remaining.totalSeconds <= 30 && remaining.totalSeconds > 0 && !showWarning) {
            setShowWarning(true);
         }

         // Ocultar advertencia si hay más de 30 segundos
         if (remaining.totalSeconds > 30 && showWarning) {
            setShowWarning(false);
         }

         setTimeRemaining(remaining);
      }, 1000);
   }, [calculateTimeRemaining, isStarted, isExpired, showWarning, autoLogoutOnExpire, onLogout, onTimeout, startDate]);

   const handleAccept = () => {
      setShowModal(false);
      if (!isStarted) {
         setIsStarted(true);
      }
   };

   const handleManualLogout = () => {
      if (timeoutRef.current) {
         clearInterval(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
         clearTimeout(warningTimeoutRef.current);
      }
      onLogout();
   };

   const handleCloseModal = () => {
      // No permitir cerrar el modal si aún no ha comenzado el countdown
      const now = new Date().getTime();
      const startTime = startDate.getTime();

      if (now < startTime) {
         return; // No se puede cerrar antes de que comience
      }

      // Solo cerrar si ya comenzó y no está expirado
      if (isStarted && !isExpired) {
         setShowModal(false);
      }
   };

   useEffect(() => {
      const initialTime = calculateTimeRemaining();
      setTimeRemaining(initialTime);

      const now = new Date().getTime();
      const startTime = startDate.getTime();

      if (now >= startTime) {
         setIsStarted(true);
      }

      startCountdown();

      return () => {
         if (timeoutRef.current) {
            clearInterval(timeoutRef.current);
         }
         if (warningTimeoutRef.current) {
            clearTimeout(warningTimeoutRef.current);
         }
      };
   }, [startCountdown, calculateTimeRemaining, startDate]);

   // Efecto para prevenir inicio de sesión si el tiempo expiró
   useEffect(() => {
      const checkSession = () => {
         const now = new Date().getTime();
         const endTime = endDate.getTime();

         if (now > endTime) {
            onLogout();
            return false;
         }
         return true;
      };

      // Verificar al montar el componente
      checkSession();

      // También podrías verificar periódicamente
      const sessionCheckInterval = setInterval(checkSession, 30000); // Cada 30 segundos

      return () => {
         clearInterval(sessionCheckInterval);
      };
   }, [endDate, onLogout]);

   if (isExpired && showWarning) {
      return (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300 scale-100">
               <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                     <ReportProblemRounded className="w-10 h-10 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Tiempo Agotado!</h2>
                  <p className="text-gray-600 mb-6">Tu sesión ha expirado. Serás redirigido automáticamente en 3 segundos.</p>
                  <div className="flex space-x-3">
                     <button
                        onClick={handleManualLogout}
                        className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center hover:cursor-pointer"
                     >
                        <LogoutRounded className="w-6 h-6 mr-2" />
                        Cerrar Sesión Ahora
                     </button>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   return (
      <>
         {/* Modal Principal */}
         {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
               <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 transform transition-all duration-300 scale-100">
                  <div className="flex justify-between items-start mb-6">
                     <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                           <WatchLaterRounded className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                           <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
                           <p className="text-gray-600 mt-2">{description}</p>
                        </div>
                     </div>

                     {isStarted && !isExpired && (
                        <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                           <ClearRounded className="w-6 h-6" />
                        </button>
                     )}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                           <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{formatTime(timeRemaining.days)}</div>
                           <div className="text-sm text-gray-500 uppercase tracking-wider">Días</div>
                        </div>
                        <div className="text-center">
                           <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{formatTime(timeRemaining.hours)}</div>
                           <div className="text-sm text-gray-500 uppercase tracking-wider">Horas</div>
                        </div>
                        <div className="text-center">
                           <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{formatTime(timeRemaining.minutes)}</div>
                           <div className="text-sm text-gray-500 uppercase tracking-wider">Minutos</div>
                        </div>
                        <div className="text-center">
                           <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{formatTime(timeRemaining.seconds)}</div>
                           <div className="text-sm text-gray-500 uppercase tracking-wider">Segundos</div>
                        </div>
                     </div>

                     {showWarning && !isExpired && (
                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
                           <ReportProblemRounded className="w-5 h-5 text-yellow-600 mr-3" />
                           <span className="text-yellow-700 font-medium">¡Atención! Tu sesión está a punto de expirar</span>
                        </div>
                     )}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center">
                     <div className="mb-4 sm:mb-0">
                        <div className="flex items-center text-gray-600">
                           <CheckCircleRounded className="w-5 h-5 text-green-500 mr-2" />
                           <span className="text-sm">
                              {isStarted ? `Sesión activa - Expira: ${endDate.toLocaleString()}` : `Inicia: ${startDate.toLocaleString()}`}
                           </span>
                        </div>
                     </div>

                     <div className="flex space-x-3">
                        {!isStarted ? (
                           <button
                              onClick={handleAccept}
                              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 hover:cursor-pointer"
                           >
                              Aceptar y Comenzar
                           </button>
                        ) : (
                           <button
                              onClick={handleAccept}
                              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 hover:cursor-pointer"
                           >
                              Continuar
                           </button>
                        )}

                        {isStarted && (
                           <button
                              onClick={handleManualLogout}
                              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center hover:cursor-pointer"
                           >
                              <LogoutRounded className="w-9 h-9 mr-2" />
                              Cerrar Sesión
                           </button>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Contador Flotante */}
         {showPersistentCounter && isStarted && !isExpired && !showModal && (
            <div className="fixed bottom-4 right-4 z-40 animate-fade-in">
               <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-64">
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center">
                        <WatchLaterRounded className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="text-sm font-semibold text-gray-700">Tiempo Restante</span>
                     </div>
                     <button onClick={() => setShowModal(true)} className="text-xs text-blue-600 hover:text-blue-800 hover:cursor-pointer font-medium">
                        Ver Detalles
                     </button>
                  </div>

                  <div className="flex justify-between items-center">
                     <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{formatTime(timeRemaining.days)}</div>
                        <div className="text-xs text-gray-500">Dias</div>
                     </div>
                     <div className="text-gray-300">:</div>
                     <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{formatTime(timeRemaining.hours)}</div>
                        <div className="text-xs text-gray-500">Horas</div>
                     </div>
                     <div className="text-gray-300">:</div>
                     <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{formatTime(timeRemaining.minutes)}</div>
                        <div className="text-xs text-gray-500">Minutos</div>
                     </div>
                     <div className="text-gray-300">:</div>
                     <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{formatTime(timeRemaining.seconds)}</div>
                        <div className="text-xs text-gray-500">Segundos</div>
                     </div>
                  </div>

                  {showWarning && (
                     <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                           <ReportProblemRounded className="w-4 h-4 text-red-500 mr-2" />
                           <span className="text-xs text-red-600 font-medium">¡Sesión por expirar!</span>
                        </div>
                     </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-gray-100">
                     <button
                        onClick={handleManualLogout}
                        className="w-full text-xs py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center hover:cursor-pointer"
                     >
                        <LogoutRounded className="w-6 h-6 mr-1" />
                        Cerrar Sesión Manualmente
                     </button>
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

// Componente de envoltura para manejar la lógica de sesión
export const SessionCountdownManager: React.FC<{
   sessionDurationMinutes?: number;
   warningMinutes?: number;
   title?: string;
   description?: string;
   onLogout: () => void;
}> = ({
   sessionDurationMinutes = 60,
   warningMinutes = 5,
   title = "Contador de Sesión",
   description = "Tu sesión tiene un tiempo límite. Por favor, completa tus actividades antes de que expire.",
   onLogout
}) => {
   const [startDate] = useState<Date>(new Date());
   const [endDate] = useState<Date>(() => {
      const end = new Date();
      end.setMinutes(end.getMinutes() + sessionDurationMinutes);
      return end;
   });

   const handleTimeout = useCallback(() => {
      console.log("Tiempo de sesión agotado");
      // Aquí puedes agregar lógica adicional al expirar el tiempo
   }, []);

   const handleLogout = useCallback(() => {
      console.log("Ejecutando logout...");
      onLogout();

      // Prevenir re-login forzando un logout inmediato si intentan iniciar sesión
      const preventReLogin = () => {
         if (document.visibilityState === "visible") {
            onLogout();
         }
      };

      document.addEventListener("visibilitychange", preventReLogin);

      // También prevenir si el usuario intenta recargar
      window.addEventListener("beforeunload", (e) => {
         e.preventDefault();
         e.returnValue = "";
         onLogout();
      });

      return () => {
         document.removeEventListener("visibilitychange", preventReLogin);
         window.removeEventListener("beforeunload", () => {});
      };
   }, [onLogout]);

   return (
      <CountdownSession
         startDate={startDate}
         endDate={endDate}
         title={title}
         description={description}
         onTimeout={handleTimeout}
         onLogout={handleLogout}
         autoLogoutOnExpire={true}
         showPersistentCounter={true}
      />
   );
};

export default CountdownSession;
