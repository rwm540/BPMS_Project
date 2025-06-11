import { createPortal } from "react-dom";
import { useRef, useEffect } from "react";

type PropsType = {
  isOpen: boolean;
  onClose: () => void;
} & {
  channel: "aparat";
  videoId: string;
};

export default function VideoModal({ isOpen, onClose, ...props }: PropsType) {
  const aparatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && aparatRef.current) {
      aparatRef.current.innerHTML = ""; // پاک‌سازی قبلی
      const script = document.createElement("script");
      script.src = `https://www.aparat.com/embed/${props.videoId}?data[rnddiv]=aparat_embed_${props.videoId}&data[responsive]=yes`;
      script.async = true;
      aparatRef.current.appendChild(script);
    }
  }, [isOpen, props.videoId]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-10">
      <div className="relative w-full max-w-4xl bg-gray-900 rounded-md p-4">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-4 translate-x-full text-7xl leading-none text-white hover:text-red-500"
          aria-label="Close modal"
        >
          &times;
        </button>
        <div ref={aparatRef} id={`aparat_embed_${props.videoId}`} />
      </div>
    </div>,
    document.body,
  );
}
