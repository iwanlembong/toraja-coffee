"use client";

export default function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title = "Konfirmasi",
    message = "Apakah kamu yakin?",
}: any) {
    if (!open) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 z-50"
                onClick={onClose}
            />

            <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-3">
                            {title}
                        </h2>

                        <p className="text-gray-600">
                            {message}
                        </p>
                    </div>

                    <div className="border-t p-4 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}