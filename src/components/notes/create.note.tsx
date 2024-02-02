import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "../LoadingButton";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNoteFn } from "../../api/noteApi";
import NProgress from "nprogress";

const styles = {

  card_container: {
    backgroundColor: '#1e293b',
  },

  card_title_container: {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '0.75rem',
  paddingBottom: '0.75rem',
  borderBottomColor: 'rgb(229, 231, 235)',
  borderBottomStyle: 'solid' as const,
  },

  card_title: {
    fontSize: '1.5rem',
    lineHeight: '2rem',
    color: 'white',
    fontWeight: '600'
  },

  card_button: {
    fontSize: '1.5rem',
    lineHeight: '2rem',
    color: 'white',
    borderRadius: '0.5rem',
    padding: '0.375rem',
    marginLeft: 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer'
  },

  card_text: {
    display: 'block',
    color: '#80e825',
    fontSize: '1.125rem',
    lineHeight: '1.75rem',
    marginBottom: '0.5rem'
  },
};

type ICreateNoteProps = {
  setOpenNoteModal: (open: boolean) => void;
};

const createNoteSchema = object({
  title: string().min(1, "Title is required"),
  content: string().min(1, "Content is required"),
});

export type CreateNoteInput = TypeOf<typeof createNoteSchema>;

const CreateNote: FC<ICreateNoteProps> = ({ setOpenNoteModal }) => {
  const methods = useForm<CreateNoteInput>({
    resolver: zodResolver(createNoteSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const queryClient = useQueryClient();

  const { mutate: createNote } = useMutation({
    mutationFn: (note: CreateNoteInput) => createNoteFn(note),
    onMutate() {
      NProgress.start();
    },
    onSuccess(data) {
      queryClient.invalidateQueries(["getNotes"]);
      setOpenNoteModal(false);
      NProgress.done();
      toast("Note created successfully", {
        type: "success",
        position: "top-right",
      });
    },
    onError(error: any) {
      setOpenNoteModal(false);
      NProgress.done();
      const resMessage =
        error.response.data.message ||
        error.response.data.detail ||
        error.message ||
        error.toString();
      toast(resMessage, {
        type: "error",
        position: "top-right",
      });
    },
  });

  const onSubmitHandler: SubmitHandler<CreateNoteInput> = async (data) => {
    createNote(data);
  };
  return (
    <section style={styles.card_container}>
      <div style={styles.card_title_container}>
        <h2 style={styles.card_title}>Send a message</h2>
        <div
          onClick={() => setOpenNoteModal(false)}
          style={styles.card_button}
        >
          <i className="bx bx-x"></i>
        </div>
      </div>
      <form className="w-full" onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="mb-2">
          <label style={styles.card_text} htmlFor="title">
            $User:
          </label>
          <input
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none bg-slate-300`,
              `${errors["title"] && "border-red-500"}`
            )}
            {...methods.register("title")}
          />
          <p
            className={twMerge(
              `text-red-500 text-xs italic mb-2 invisible`,
              `${errors["title"] && "visible"}`
            )}
          >
            {errors["title"]?.message as string}
          </p>
        </div>
        <div className="mb-2">
          <label style={styles.card_text} htmlFor="title">
            $message
          </label>
          <textarea
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2 leading-tight focus:outline-none bg-slate-300`,
              `${errors.content && "border-red-500"}`
            )}
            rows={6}
            {...register("content")}
          />
          <p
            className={twMerge(
              `text-red-500 text-xs italic mb-2`,
              `${errors.content ? "visible" : "invisible"}`
            )}
          >
            {errors.content && errors.content.message}
          </p>
        </div>
        <LoadingButton loading={false}>Dispatch</LoadingButton>
      </form>
    </section>
  );
};

export default CreateNote;
