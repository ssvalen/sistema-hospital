import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/shared/components/forms/Button";
import Input from "@/shared/components/forms/Input";
import FormField from "@/shared/components/forms/FormField";
import Modal from "@/shared/components/Modal";
import Toast from "@/shared/components/Toast";

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
import Select from "@/shared/components/forms/Select";

const ETLAdminPage = () => {

    const navigate = useNavigate();
    const { toast, showToast, hideToast } = useToast();

    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [processType, setProcessType] = useState("PATIENTS");
    const [openConfirm, setOpenConfirm] = useState(false);
    const [uploading, setUploading] = useState(false);

    const validate = () => {

        if (!file) {
            showToast("Seleccione un archivo", TOAST_TYPES.ERROR);
            return false;
        }

        if (!description.trim()) {
            showToast("Ingrese descripción del proceso", TOAST_TYPES.ERROR);
            return false;
        }

        return true;
    };

    const handleUpload = async () => {

        if (!validate()) return;

        setUploading(true);

        try {


            showToast("Archivo cargado correctamente", TOAST_TYPES.SUCCESS);

            setTimeout(() => {
                setUploading(false);
                setOpenConfirm(false);
                navigate(-1);
            }, TOAST_CONFIG.success.duration);

        } catch (error) {
            setUploading(false);
            showToast("Error al cargar archivo", TOAST_TYPES.ERROR);
        }
    };

    return (
        <>
            <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800">
                            Carga de proceso ETL
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Suba archivos para procesamiento automático
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
                    <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">

                        <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faUpload} className="text-blue-600" />
                            <h2 className="text-lg font-semibold text-slate-700">
                                Datos del archivo
                            </h2>
                        </div>

                        <FormField label="Tipo de proceso">
                            <Select
                                value={processType}
                                onChange={(e) => setProcessType(e.target.value)}

                            >
                                <option>Seleccione</option>
                                <option value="PATIENTS">Pacientes</option>
                                <option value="INVENTORY">Inventario</option>
                            </Select>
                        </FormField>

                        <FormField label="Descripción">
                            <Input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ej: Carga masiva marzo 2026"
                            />
                        </FormField>

                        <FormField label="Archivo (CSV)">
                            <Input
                                type="file"
                                accept=".csv"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                            {/* <input
                                type="file"
                                accept=".csv"
                                className="w-full text-sm text-slate-600"
                            /> */}
                        </FormField>

                        <div className="flex justify-end">
                            <Button
                                icon={faUpload}
                                label="Cargar archivo"
                                color="blue"
                                onClick={() => setOpenConfirm(true)}
                            />
                        </div>

                    </div>

                    {/* PANEL LATERAL */}
                    <div className="space-y-5">

                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <div className="flex gap-3 items-center mb-3">
                                <FontAwesomeIcon icon={faDatabase} className="text-green-600" />
                                <h2 className="font-semibold text-slate-700">
                                    Procesamiento ETL
                                </h2>
                            </div>

                            <p className="text-sm text-slate-500">
                                El archivo será almacenado en el servidor y procesado
                                automáticamente por el servicio ETL.
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                            <div className="flex gap-2 items-center mb-2">
                                <FontAwesomeIcon icon={faFileCsv} className="text-blue-600" />
                                <p className="font-semibold text-blue-700">
                                    Requisitos del archivo
                                </p>
                            </div>

                            <ul className="text-sm text-blue-600 list-disc list-inside space-y-1">
                                <li>Formato CSV</li>
                                <li>Codificación UTF-8</li>
                                <li>Encabezados obligatorios</li>
                                <li>Tamaño máximo 10MB</li>
                            </ul>
                        </div>

                    </div>

                </div>
            </div>

            {/* MODAL CONFIRMACIÓN */}
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
                        <p><strong>Proceso:</strong> {processType}</p>
                        <p><strong>Archivo:</strong> {file?.name}</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">

                        <Button
                            label="Cancelar"
                            color="gray"
                            variant="outline"
                            onClick={() => setOpenConfirm(false)}
                        />

                        <Button
                            icon={faUpload}
                            label={uploading ? "Subiendo..." : "Confirmar"}
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