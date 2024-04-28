import { useState } from 'react';
import axios from 'axios';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Spinner } from "@nextui-org/react";

export const Login = ({setIsLoggedIn, isOpen, onOpenChange }: {setIsLoggedIn: (isLoggedIn: boolean) => void; isOpen: boolean; onOpenChange: (isOpen: boolean) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usernameErrors, setUsernameErrors] = useState([] as string[]);
  const [passwordErrors, setPasswordErrors] = useState([] as string[]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/log-in',
        {
          username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log('logged in successful');
        setIsLoggedIn(true);
      } else {
        console.error('Failed to log in');
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      if ((error as any).response && (error as any).response.data && (error as any).response.data.errors) {
        const { errors } = (error as any).response.data;
        setUsernameErrors([]);
        setPasswordErrors([]);

        errors.forEach((err: any) => {
          switch (err.path) {
            case 'username':
              setUsernameErrors(prevErrors => [...prevErrors, err.msg]);
              break;
            case 'password':
              setPasswordErrors(prevErrors => [...prevErrors, err.msg]);
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
      case 'username':
        setUsernameErrors([] as string[]);
        break;
      case 'password':
        setPasswordErrors([] as string[]);
        break;
      default:
        break;
    }
  };
  const handleModalOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    // Set isSignedIn to false when modal is closed
    if (!isOpen) {
      setIsLoggedIn(false);
      clearForm();
    }
  };
  const clearForm = () => {
    setUsername('');
    setPassword('');
    setUsernameErrors([]);
    setPasswordErrors([]);
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
              <form onSubmit={handleSubmit}>
                <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
                <ModalBody>

                  <div className="flex flex-col space-y-1">
                    <Input
                      name="username"
                      value={username}
                      label="Email"
                      placeholder="Enter your Email"
                      variant="bordered"
                      onChange={(e) => setUsername(e.target.value)}
                      onFocus={() => handleInputFocus('username')} // Clear email error on focus
                      required
                    />
                    {usernameErrors && <span className="flex flex-col ml-5 text-sm text-red-700">{usernameErrors.map(error => (
                      <ul key={error} className=''>
                        <li className='list-disc'>{error}</li>
                      </ul>
                    ))}</span>}
                  </div>

                  <div className="flex flex-col space-y-1">
                    <Input
                      name="password"
                      value={password}
                      label="Password"
                      placeholder="Enter your password"
                      type="password"
                      variant="bordered"
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => handleInputFocus('password')} // Clear password error on focus
                      required
                    />
                    {passwordErrors && <span className="flex flex-col ml-5 text-sm text-red-700">{passwordErrors.map(error => (
                      <ul key={error} className=''>
                        <li className='list-disc'>{error}</li>
                      </ul>
                    ))}</span>}
                  </div>

                </ModalBody>
                <ModalFooter className="flex justify-center w-full">
                  <Button className="w-full" color="primary" type="submit">
                    Log in
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
