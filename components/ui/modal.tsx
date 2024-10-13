// Modal.tsx (your modal component)
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/components/ui/dialog';

interface ModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  children
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        forceMount
        onEscapeKeyDown={(e) => e.preventDefault()} // Disable escape key close
        onPointerDownOutside={(e) => e.preventDefault()} // Disable outside click close
      >
        <div className="p-4">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </div>

        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
