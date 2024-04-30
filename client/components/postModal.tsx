import { useState } from 'react';
import axios from 'axios';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Spinner } from "@nextui-org/react";

export const Post = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (isOpen: boolean) => void }) => {
  const [post, setPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [postErrors, setPostErrors] = useState([] as string[]);

  const handlePosting = async (e: { preventDefault: () => void; }) => {
    setIsLoading(true);
    e.preventDefault();
    try {
        // Make a POST request to post endpoint
        const response = await axios.post('http://localhost:3000/api/new-post', {
            withCredentials: true,
        });

        // Check if the logout was successful
        if (response.status === 200) {
            console.log('posted successful');
        } else {
            console.error('Posting failed:', response.statusText);
        }
    }  catch (error) {
      console.error('Error logging in:', error);
      if ((error as any).response && (error as any).response.data && (error as any).response.data.errors) {
        const { errors } = (error as any).response.data;
        setPostErrors([]);

        errors.forEach((err: any) => {
          switch (err.path) {
            case 'post':
                setPostErrors(prevErrors => [...prevErrors, err.msg]);
              break;
            default:
              break;
          }
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  // Function to clear error messages when the user interacts with input fields
  const handleInputFocus = (fieldName: string) => {
    switch (fieldName) {
      case 'post':
        setPostErrors([] as string[]);
        break;
      default:
        break;
    }
  };
  const handleModalOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      clearForm();
    }
  };

  const clearForm = () => {
    setPost('');
    setPostErrors([]);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={handleModalOpenChange}
        placement="center"
        backdrop='blur'

      >
        <ModalContent>
          <div className='flex flex-col justify-center h-full'>
            {(isLoading ?
              <Spinner className='my-[32%]' size="lg" /> :
              <form onSubmit={handlePosting}>
                <ModalHeader className="flex flex-col gap-1">New Post</ModalHeader>
                <ModalBody>

                  <div className="flex flex-col space-y-1">
                    <Input
                      name="post"
                      value={post}
                      label="Post"
                      placeholder="Enter your Thoughts"
                      variant="bordered"
                      onChange={(e) => setPost(e.target.value)}
                      onFocus={() => handleInputFocus('post')} // Clear email error on focus
                      required
                    />
                    {postErrors && <span className="flex flex-col ml-5 text-sm text-red-700">{postErrors.map(error => (
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
}
