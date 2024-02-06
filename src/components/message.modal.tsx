import ReactDom from "react-dom";
import React, { FC } from "react";

type IMessageModal = {
  openMessageModal: boolean;
  setOpenMessageModal: (open: boolean) => void;
  children?: React.ReactNode;
};

const MessageModal: FC<IMessageModal> = ({
  openMessageModal,
  setOpenMessageModal,
  children,
}) => {
  if (!openMessageModal) return null;
  return ReactDom.createPortal(
    <>
      <div
        className="fixed inset-0 bg-[rgba(0,0,0,.5)] z-[1000]"
        onClick={() => setOpenMessageModal(false)}
      ></div>
      <div className="max-w-lg w-full rounded-md fixed top-0 lg:top-[10%] left-1/2 -translate-x-1/2 bg-slate-800 z-[1001] p-6">
        {children}
      </div>
    </>,
    document.getElementById("message-modal") as HTMLElement
  );
};

export default MessageModal;
