"use client";

import type { ReactNode } from "react";
import { Dialog } from "@headlessui/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black bg-opacity-60" aria-hidden="true" />
      <Dialog.Panel className="relative bg-white rounded-xl shadow-lg w-11/12 max-w-lg p-6 z-50">
        {title && <Dialog.Title className="text-lg font-bold mb-4">{title}</Dialog.Title>}
        {children}
        <div className="mt-4 flex justify-end">
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
