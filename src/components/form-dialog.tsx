import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { cn } from '@/lib/utils';

interface FormDialogProps {
  trigger?: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  description?: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  className?: string;
}

const FormDialog = ({
  children,
  trigger,
  title,
  description,
  open,
  onOpenChange,
  className,
}: FormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className={cn('', className)}>{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
