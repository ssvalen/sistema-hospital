import { useEffect } from "react";

type Props = {
  show: boolean;
  message: string;
  duration?: number;
  onClose: () => void;
};

const Toast = ({
  show,
  message,
  duration = 3000,
  onClose,
}: Props) => {

  useEffect(() => {

    if (!show) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);

  }, [show, duration, onClose]);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed top-5 right-5 z-50 animate-fade-in">

      <div className="bg-red-500 text-white px-5 py-3 rounded-xl shadow-lg min-w-[250px]">
        {message}
      </div>

    </div>
  );
};

export default Toast;