import "react-toastify/dist/ReactToastify.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { getMessagesFn } from "./api/noteApi";
import NoteModal from "./components/message.modal";
import CreateNote from "./components/messages/create.note";
import MessageItem from "./components/messages/note.component";
import NProgress from "nprogress";
import { max } from "date-fns";

const styles = {

  card_container: {
    maxwidth: '68rem',
    margin: 'auto',
    backgroundColor: '#2b3645',
  },

  mensage_container: {
    margin: '2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1rem',
    gridTemplateRows: '1fr',
  },

  card_insert: {
    padding: '1rem', 
    minHeight: '18rem', 
    backgroundColor: 'white', 
    borderRadius: '0.5rem', 
    border: '1px solid black',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', 
    display: 'flex', 
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center', 
  },

  card_button:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '5rem', 
    width: '5rem', 
    border: '2px dashed black',
    borderRadius: '9999px',
    color: 'black', 
    fontSize: '3rem',
    cursor: 'pointer',
  },
  card_text: {
    fontSize: '1.125rem',
    fontWeight: '500', 
    color: 'black', 
    marginTop: '1.25rem',
    cursor: 'pointer',
  },

};


function AppContent() {
  const [openMessageModal, setOpenMessageModal] = useState(false);

  const {
    data: messages,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["getMessages"],
    queryFn: () => getMessagesFn(),
    staleTime: 5 * 1000,
    select: (data) => data.mensagem,
    onSuccess() {
      NProgress.done();
    },
    onError(error: any) {
      const resMessage =
        error.response.data.mensagem ||
        error.response.data.detail ||
        error.mensagem ||
        error.toString();
      toast(resMessage, {
        type: "error",
        position: "top-right",
      });
      NProgress.done();
    },
  });

  useEffect(() => {
    if (isLoading || isFetching) {
      NProgress.start();
    }
  }, [isLoading, isFetching]);

  return (
    <div style={styles.card_container}>
      <div style={styles.mensage_container}>
        <div style={styles.card_insert}>
          <div
            onClick={() => setOpenMessageModal(true)}
            style={styles.card_button}
          >
            <i className="bx bx-plus"></i>
          </div>
          <h4
            onClick={() => setOpenMessageModal(true)}
            style={styles.card_text}
          >
            Leave my server a message!
          </h4>
        </div>
        {/* Note Items */}

        {messages?.map((message) => (
          <MessageItem key={message.id} mensagem={message} />
        ))}

        {/* Create Note Modal */}
        <NoteModal
          openMessageModal={openMessageModal}
          setOpenMessageModal={setOpenMessageModal}
        >
          <CreateNote setOpenMessageModal={setOpenMessageModal} />
        </NoteModal>
      </div>
    </div>
  );
}

function App() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AppContent />
        <ToastContainer />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
