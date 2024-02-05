import React, { FC, useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";
import MessageModal from "../message.modal";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import NProgress from "nprogress";
import { IMessage } from "../../api/types";

type MessageItemProps = {
  message: IMessage;
};

const MessageItem: FC<MessageItemProps> = ({ message }) => {
  const [openSettings, setOpenSettings] = useState(false);
  const [openMessageModal, setOpenMessageModal] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dropdown = document.getElementById(`settings-dropdown-${message.id}`);

      if (dropdown && !dropdown.contains(target)) {
        setOpenSettings(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [message.id]);

  const queryClient = useQueryClient();
  return (
    <>
      <div className="p-4 bg-black rounded-lg border border-black shadow-md flex flex-col justify-between overflow-hidden">
        <div className="details">
          <h4 className="mb-2 pb-2 text-2xl font-semibold tracking-tight text-ct-green-hacker">
            $User:&nbsp;
            {message.nome.length > 40
              ? message.nome.substring(0, 40) + "..."
              : message.nome}
          </h4>
          <p className="mb-3 font-normal text-ct-green-hacker">
          $Message:&nbsp;
            {message.mensagem.length > 210
              ? message.mensagem.substring(0, 210) + "..."
              : message.mensagem}
          </p>
        </div>
        <div className="relative border-t border-black flex justify-between items-center">
          <span className="text-ct-green-hacker text-sm">
            {format(parseISO(String(message.data)), "PPP")}
          </span>
        </div>
      </div>
      <MessageModal
        openMessageModal={openMessageModal}
        setOpenMessageModal={setOpenMessageModal}
      >
        {/* <UpdateNote note={message} setOpenNoteModal={setOpenNoteModal} /> */}
      </MessageModal>
    </>
  );
};

export default MessageItem;
