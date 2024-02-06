import React, { FC, useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";
import MessageModal from "../message.modal";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import NProgress from "nprogress";
import { IMessage } from "../../api/types";

type MessageItemProps = {
  mensagem: IMessage;
};

const MessageItem: FC<MessageItemProps> = ({ mensagem }) => {
  const [openSettings, setOpenSettings] = useState(false);
  const [openMessageModal, setOpenMessageModal] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dropdown = document.getElementById(`settings-dropdown-${mensagem.id}`);

      if (dropdown && !dropdown.contains(target)) {
        setOpenSettings(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [mensagem.id]);

  const queryClient = useQueryClient();
  return (
    <>
      <div className="p-4 bg-black rounded-lg border border-black shadow-md flex flex-col justify-between overflow-hidden">
        <div className="details">
          <h4 className="mb-2 pb-2 text-2xl font-semibold tracking-tight text-ct-green-hacker">
            $User:&nbsp;
            {mensagem.nome.length > 40
              ? mensagem.nome.substring(0, 40) + "..."
              : mensagem.nome}
          </h4>
          <p className="mb-3 font-normal text-ct-green-hacker">
          $Message:&nbsp;
            {mensagem.mensagem.length > 210
              ? mensagem.mensagem.substring(0, 210) + "..."
              : mensagem.mensagem}
          </p>
        </div>
        <div className="relative border-t border-black flex justify-between items-center">
          <span className="text-ct-green-hacker text-sm">
            {format(parseISO(String(mensagem.data)), "PPP")}
          </span>
        </div>
      </div>
      <MessageModal
        openMessageModal={openMessageModal}
        setOpenMessageModal={setOpenMessageModal}
      >
      </MessageModal>
    </>
  );
};

export default MessageItem;
