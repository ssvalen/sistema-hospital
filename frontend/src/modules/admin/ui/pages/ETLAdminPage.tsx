import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/shared/components/forms/Button";
import FormField from "@/shared/components/forms/FormField";
import Modal from "@/shared/components/Modal";
import Toast from "@/shared/components/Toast";
import Select from "@/shared/components/forms/Select";

import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";
import { TOAST_CONFIG } from "@/shared/types/ToastConfig";

import {
    faArrowLeft,
    faUpload,
    faDatabase,
    faFileCsv
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { EtlLoadTypes } from "../../types/EtlTypes";
import { useUploadEtl } from "../../hooks/etl/useUploadEtl";
import { HttpError } from "@/shared/errors/HttpError";
import Input from "@/shared/components/forms/Input";

const ETLAdminPage = () => {

    const navigate = useNavigate();
    const { toast, showToast, hideToast } = useToast();

    const uploadFile = useUploadEtl()

    const [file, setFile] = useState<File | null>(null);
    const [processType, setProcessType] = useState<EtlLoadTypes>("PATIENTS");
    const [openConfirm, setOpenConfirm] = useState(false);

    const [inputKey, setInputKey] = useState(0);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {

        const selectedFile = e.target.files?.[0] || null;

        if (!selectedFile) return;

        const isCsvExtension = selectedFile.name.toLowerCase().endsWith(".csv");

        const isCsvMime =
            selectedFile.type === "text/csv" ||
            selectedFile.type === "application/vnd.ms-excel" ||
            selectedFile.type === "";

        if (!isCsvExtension || !isCsvMime) {
            showToast("Solo se permiten archivos CSV válidos", TOAST_TYPES.ERROR);

            setInputKey(prev => prev + 1);
            return;
        }

        const maxSize = 10 * 1024 * 1024;
        if (selectedFile.size > maxSize) {
            showToast("El archivo excede el tamaño máximo de 10MB", TOAST_TYPES.ERROR);
            setInputKey(prev => prev + 1);
            return;
        }

        setFile(selectedFile);
    };

    const validate = () => {

        if (!file) {
            showToast("Seleccione un archivo", TOAST_TYPES.ERROR);
            return false;
        }

        const isCsvExtension = file.name.toLowerCase().endsWith(".csv");

        const isCsvMime =
            file.type === "text/csv" ||
            file.type === "application/vnd.ms-excel" ||
            file.type === "";

        if (!isCsvExtension || !isCsvMime) {
            showToast("El archivo debe ser un CSV válido", TOAST_TYPES.ERROR);
            return false;
        }

        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            showToast("El archivo excede el tamaño máximo de 10MB", TOAST_TYPES.ERROR);
            return false;
        }

        return true;
    };

    const handleUpload = async () => {

        if (!validate() || !file) return;

        try {

            const uploadStatus = await uploadFile.mutateAsync({
                file,
                loadType: processType
            });

            if (!uploadStatus) {
                showToast("No se pudo completar la carga del archivo", TOAST_TYPES.ERROR);
                return;
            }

            // ✅ RESET DEL FORMULARIO
            setFile(null);
            setProcessType("PATIENTS");
            setInputKey(prev => prev + 1);

            setOpenConfirm(false);

            showToast(
                "Archivo cargado correctamente. El ETL lo procesará automáticamente y los resultados estarán disponibles cuando finalice la carga.",
                TOAST_TYPES.SUCCESS
            );

        } catch (error) {

            if (error instanceof HttpError) {
                showToast(`${error.message}`, TOAST_TYPES.ERROR)
                return
            }

            showToast(
                "Ocurrio un error al cargar el archivo",
                TOAST_TYPES.ERROR
            );
        }
    };

    return (
        <>
            <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

                <div className="max-w-7xl mx-auto space-y-8">

                    {/* HEADER */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">
                                Carga de proceso ETL
                            </h1>

                            <p className="text-slate-500 mt-1">
                                Suba archivos CSV para procesamiento automático
                            </p>
                        </div>

                        <Button
                            icon={faArrowLeft}
                            label="Volver"
                            color="gray"
                            variant="outline"
                            onClick={() => navigate(-1)}
                        />

                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                        {/* FORMULARIO */}
                        <div className="xl:col-span-2">

                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

                                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">

                                    <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <FontAwesomeIcon
                                            icon={faUpload}
                                            className="text-blue-600"
                                        />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-slate-800">
                                            Datos del archivo
                                        </h2>

                                        <p className="text-sm text-slate-500">
                                            Seleccione el proceso y cargue un CSV
                                        </p>
                                    </div>

                                </div>

                                <div className="p-6 space-y-6">

                                    <FormField label="Tipo de proceso">

                                        <Select
                                            value={processType}
                                            onChange={(e) =>
                                                setProcessType(
                                                    e.target.value as EtlLoadTypes
                                                )
                                            }
                                        >
                                            <option value="PATIENTS">
                                                Pacientes
                                            </option>

                                            <option value="INVENTORY">
                                                Inventario
                                            </option>

                                        </Select>

                                    </FormField>

                                    <FormField label="Archivo CSV">

                                        <label
                                            className="
                                                block
                                                border-2
                                                border-dashed
                                                border-slate-300
                                                rounded-2xl
                                                p-10
                                                text-center
                                                cursor-pointer
                                                transition-all
                                                duration-200
                                                hover:border-blue-400
                                                hover:bg-blue-50
                                            "
                                        >

                                            <Input
                                                key={inputKey}
                                                type="file"
                                                accept=".csv"
                                                className="hidden"
                                                onChange={handleFile}
                                            />

                                            <FontAwesomeIcon
                                                icon={faFileCsv}
                                                className="text-5xl text-blue-500 mb-4"
                                            />

                                            <p className="font-medium text-slate-700">
                                                Haga clic para seleccionar un archivo
                                            </p>

                                            <p className="text-sm text-slate-500 mt-2">
                                                Formato CSV
                                            </p>

                                        </label>

                                    </FormField>

                                    {file && (

                                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">

                                            <div className="flex items-center gap-3">

                                                <FontAwesomeIcon
                                                    icon={faFileCsv}
                                                    className="text-emerald-600"
                                                />

                                                <div>

                                                    <p className="font-medium text-emerald-800">
                                                        {file.name}
                                                    </p>

                                                    <p className="text-xs text-emerald-600">
                                                        {(file.size / 1024).toFixed(2)} KB
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    )}

                                    <div className="flex justify-end">

                                        <Button
                                            icon={faUpload}
                                            label="Cargar archivo"
                                            color="blue"
                                            disabled={!file}
                                            onClick={() =>
                                                setOpenConfirm(true)
                                            }
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* SIDEBAR */}
                        <div className="space-y-6">

                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">

                                <div className="flex items-center gap-3 mb-4">

                                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">

                                        <FontAwesomeIcon
                                            icon={faDatabase}
                                            className="text-green-600"
                                        />

                                    </div>

                                    <h2 className="font-semibold text-slate-800">
                                        Procesamiento ETL
                                    </h2>

                                </div>

                                <p className="text-sm text-slate-500 leading-relaxed">
                                    El archivo será almacenado y procesado
                                    automáticamente por el servicio ETL.
                                </p>

                            </div>

                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white">

                                <div className="flex items-center gap-2 mb-4">

                                    <FontAwesomeIcon icon={faFileCsv} />

                                    <h2 className="font-semibold">
                                        Requisitos del archivo
                                    </h2>

                                </div>

                                <ul className="space-y-2 text-sm text-blue-100">

                                    <li>✓ Formato CSV</li>
                                    <li>✓ Codificación UTF-8</li>
                                    <li>✓ Encabezados obligatorios</li>
                                    <li>✓ Tamaño máximo 10MB</li>

                                </ul>

                            </div>

                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">

                                <h2 className="font-semibold text-slate-800 mb-3">
                                    Proceso seleccionado
                                </h2>

                                <span className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-medium">
                                    {processType}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <Modal
                abierto={openConfirm}
                onClose={() => setOpenConfirm(false)}
                titulo="Confirmar carga ETL"
                size="md"
            >
                <div className="space-y-5">

                    <p className="text-slate-600">
                        ¿Desea cargar el archivo para procesamiento?
                    </p>

                    <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">

                        <p>
                            <strong>Proceso:</strong> {processType}
                        </p>

                        <p>
                            <strong>Archivo:</strong> {file?.name}
                        </p>

                    </div>

                    <div className="flex justify-end gap-3 pt-2">

                        <Button
                            label="Cancelar"
                            color="gray"
                            variant="outline"
                            onClick={() =>
                                setOpenConfirm(false)
                            }
                        />

                        <Button
                            icon={faUpload}
                            label={
                                uploadFile.isPending
                                    ? "Subiendo..."
                                    : "Confirmar"
                            }
                            color="blue"
                            onClick={handleUpload}
                        />

                    </div>

                </div>

            </Modal>

            <div className="fixed top-4 right-4 z-[99999]">

                <Toast
                    show={toast.show}
                    type={toast.type}
                    message={toast.message}
                    onClose={hideToast}
                />

            </div>

        </>
    );
};

export default ETLAdminPage;