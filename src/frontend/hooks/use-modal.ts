"use client";

import { useState } from "react";

export function useModal(defaultOpen = false) {
  const [isModalOpen, setIsModalOpen] = useState(defaultOpen);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const onOpenChange = (open: boolean) => setIsModalOpen(open);

  return {
    isModalOpen,
    openModal,
    closeModal,
    onOpenChange,
  };
}
