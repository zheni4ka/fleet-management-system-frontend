"use client";

import { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function ModalWindow({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);


  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose} // Обробляє закриття через Esc
      onClick={handleBackdropClick}
      className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg shadow-xl backdrop:bg-black/50 backdrop:backdrop-blur-sm max-w-md w-full border border-gray-200 overflow-visible"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none">
          &times;
        </button>
      </div>
      <div className="text-gray-600 flex gap-px-20 flex-col">
        {children}
      </div>
    </dialog>
  );
}