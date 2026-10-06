"use client";

import React from "react";
import { HeartsModal } from "@/components/ui/HeartsModal";

export interface OutOfHeartsModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const OutOfHeartsModal: React.FC<OutOfHeartsModalProps> = ({
  isOpen,
  onClose = () => {},
}) => {
  return (
    <HeartsModal
      isOpen={isOpen}
      onClose={onClose}
      isInLesson={true}
    />
  );
};
