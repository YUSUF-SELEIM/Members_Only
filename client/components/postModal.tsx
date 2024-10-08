import { useMemo, useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic'; // Import dynamic from next/dynamic
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Spinner } from "@nextui-org/react";
import "react-quill/dist/quill.snow.css";
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

export const Post = ({ userData, isOpen, onOpenChange }: { userData: any; isOpen: boolean; onOpenChange: (isOpen: boolean) => void }) => {
  const [editorValue, setEditorValue] = useState(""); // State to store editor value
  const [isLoading, setIsLoading] = useState(false);
  const [editorErrors, setEditorErrors] = useState([] as string[]);

  const handlePosting = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editorValue === "") {
        setEditorErrors(['Post cannot be empty']);
        setIsLoading(false);
        return;
      }
      // Make a POST request to post endpoint
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_END_URL}/api/new-post`, {
        creatorName: userData.name,
        creatorEmail: userData.email,
        post: editorValue
      }, {
        withCredentials: true,
      });

      // Check if the logout was successful
      if (response.status === 200) {
        window.location.reload();
        handleModalOpenChange(false);
        console.log('posted successful');
      } else {
        console.error('Posting failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error logging in:', error);

    } finally {
      setIsLoading(false);
    }
  };
  // Function to clear error messages when the user interacts with input fields
  const handleInputFocus = () => {
    setEditorErrors([] as string[]);
  };
  const handleModalOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      clearForm();
    }
  };

  const clearForm = () => {
    setEditorValue('');

    setEditorErrors([]);
  };
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },

          ],
          ["link"],
          ["clean"],
        ],

      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "clean",
  ];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={handleModalOpenChange}
        placement="center"
        backdrop='blur'
        size='lg'
      >
        <ModalContent>
          <div className='flex flex-col justify-center h-full'>
            {(isLoading ?
              <Spinner className='my-[32%]' size="lg" /> :
              <form onSubmit={handlePosting}>
                <ModalHeader className="flex flex-col gap-1">New Post</ModalHeader>
                <ModalBody>
                  <div className="flex flex-col space-y-12">
                    <QuillEditor
                      className="h-[150px] rounded-full"
                      theme="snow"
                      formats={formats}
                      modules={modules}
                      value={editorValue}
                      onChange={(value) => {
                        setEditorValue(value);
                        handleInputFocus();
                      }}
                    />
                    {editorErrors && <span className="flex flex-col ml-5 text-sm text-red-700">{editorErrors.map(error => (
                      <ul key={error} className=''>
                        <li className='list-disc'>{error}</li>
                      </ul>
                    ))}</span>}
                  </div>

                </ModalBody>
                <ModalFooter className="flex justify-center w-full">
                  <Button className="w-full" color="primary" type="submit">
                    Post
                  </Button>
                </ModalFooter>
              </form>
            )}
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};
