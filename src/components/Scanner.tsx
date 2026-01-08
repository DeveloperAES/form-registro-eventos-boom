import { useEffect, useRef, useState } from "react";
import "../QrStyles.css";
import QrScanner from "qr-scanner";

const QrReader = () => {
    const scanner = useRef<QrScanner | null>(null);
    const videoEl = useRef<HTMLVideoElement | null>(null);
    const qrBoxEl = useRef<HTMLDivElement | null>(null);

    const [qrOn, setQrOn] = useState<boolean>(false);
    const [scannedResult, setScannedResult] = useState<string>("");
    const [responseHtml, setResponseHtml] = useState<string>(""); // para mostrar respuesta del backend
    const [loading, setLoading] = useState<boolean>(false);

    // ✅ Lógica cuando se escanea correctamente
    const onScanSuccess = async (result: QrScanner.ScanResult) => {
        const scannedData = result.data.trim();
        console.log("✅ QR Scanned:", scannedData);
        setScannedResult(scannedData);

        // Si el QR contiene una URL válida que apunta a tu API
        if (scannedData.includes("/api/registros/validar/")) {
            try {
                setLoading(true);
                setResponseHtml("");

                // Extraer el UUID desde la URL
                const uuid = scannedData.split("/").pop();

                if (!uuid) {
                    setResponseHtml("<h3>❌ QR inválido (no contiene UUID)</h3>");
                    return;
                }

                // Llamar a tu servicio backend
                const response = await fetch(`http://localhost:4000/api/registros/validar/${uuid}`);
                const html = await response.text();

                // Mostrar respuesta dentro de la app
                setResponseHtml(html);
            } catch (error: any) {
                console.error("❌ Error al validar asistencia:", error);
                setResponseHtml(`<h3>⚠️ Error de conexión con el servidor</h3><p>${error.message}</p>`);
            } finally {
                setLoading(false);
            }
        } else {
            console.warn("El QR no apunta al servicio esperado:", scannedData);
            setResponseHtml("<h3>⚠️ QR no corresponde a un código de validación</h3>");
        }
    };

    // ⚠️ Manejar errores de decodificación
    const onScanFail = (err: string | Error) => {
        console.warn("QR Scan Error:", err);
    };

    // 🎥 Inicializar cámara
    useEffect(() => {
        if (videoEl.current && !scanner.current) {
            scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
                onDecodeError: onScanFail,
                preferredCamera: "environment",
                highlightScanRegion: true,
                highlightCodeOutline: true,
                overlay: qrBoxEl.current || undefined,
            });

            scanner.current
                .start()
                .then(() => {
                    console.log("📷 Cámara iniciada");
                    setQrOn(true);
                })
                .catch((err) => {
                    console.error("❌ No se pudo iniciar la cámara:", err);
                    setQrOn(false);
                });
        }

        return () => {
            console.log("🛑 Deteniendo QR Scanner...");
            scanner.current?.stop();
            scanner.current = null;
        };
    }, []);

    useEffect(() => {
        if (!qrOn) {
            alert(
                "La cámara está bloqueada o no es accesible. Por favor, permite el acceso a la cámara y recarga la página."
            );
        }
    }, [qrOn]);

    return (
        <div className="qr-reader">
            {/* 📸 Video */}
            <video ref={videoEl} className="qr-video" />

            {/* 🖼 Overlay */}
            <div ref={qrBoxEl} className="qr-box">
                {!qrOn && (
                    <img
                        src="/static/images/icons/scan_qr1.svg"
                        alt="QR Frame"
                        width={256}
                        height={256}
                        className="qr-frame"
                    />
                )}
            </div>

            {/* Estado */}
            {loading && (
                <div className="qr-result">
                    <p>Validando asistencia...</p>
                </div>
            )}

            {/* Resultado del servidor */}
            {!loading && responseHtml && (
                <div
                    className="qr-server-response"
                    dangerouslySetInnerHTML={{ __html: responseHtml }}
                />
            )}

            {/* Datos escaneados (opcional) */}
            {!loading && scannedResult && (
                <p className="qr-debug">📋 {scannedResult}</p>
            )}
        </div>
    );
};

export default QrReader;
