import "react-toastify/dist/ReactToastify.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { getNotesFn } from "./api/noteApi";
import NoteModal from "./components/note.modal";
import CreateNote from "./components/notes/create.note";
import NoteItem from "./components/notes/note.component";
import NProgress from "nprogress";
import { max } from "date-fns";

const styles = {

  card_container: {
    maxwidth: '68rem',
    margin: 'auto',
    backgroundColor: 'black',
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
    backgroundColor: '#8ff205', 
    borderRadius: '0.5rem', 
    border: '1px solid #8ff205',
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
  const [openNoteModal, setOpenNoteModal] = useState(false);

  const {
    data: notes,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["getNotes"],
    queryFn: () => getNotesFn(),
    staleTime: 5 * 1000,
    select: (data) => data.notes,
    onSuccess() {
      NProgress.done();
    },
    onError(error: any) {
      const resMessage =
        error.response.data.message ||
        error.response.data.detail ||
        error.message ||
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
            onClick={() => setOpenNoteModal(true)}
            style={styles.card_button}
          >
            <i className="bx bx-plus"></i>
          </div>
          <h4
            onClick={() => setOpenNoteModal(true)}
            style={styles.card_text}
          >
            Leave my server a message!
          </h4>
        </div>
        {/* Note Items */}

        {notes?.map((note) => (
          <NoteItem key={note.id} note={note} />
        ))}

        {/* Create Note Modal */}
        <NoteModal
          openNoteModal={openNoteModal}
          setOpenNoteModal={setOpenNoteModal}
        >
          <CreateNote setOpenNoteModal={setOpenNoteModal} />
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
