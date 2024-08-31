import { useState } from 'react';
import axios from 'axios';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Spinner } from "@nextui-org/react";
import { CheckCircle } from 'react-feather'; // Importing the green tick icon

export const Signup = ({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nameErrors, setNameErrors] = useState([] as string[]);
  const [emailErrors, setEmailErrors] = useState([] as string[]);
  const [passwordErrors, setPasswordErrors] = useState([] as string[]);
  const [passwordConfirmationErrors, setPasswordConfirmationErrors] = useState([] as string[]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END_URL}/api/sign-up`,
        {
          name,
          email,
          password,
          confirmPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        console.log('Signup successful');
        setIsSignedIn(true);
      } else {
        console.error('Failed to sign up');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      if ((error as any).response && (error as any).response.data && (error as any).response.data.errors) {
        const { errors } = (error as any).response.data;
        setNameErrors([]);
        setEmailErrors([]);
        setPasswordErrors([]);
        setPasswordConfirmationErrors([]);
        errors.forEach((err: any) => {
          switch (err.path) {
            case 'name':
              setNameErrors(prevErrors => [...prevErrors, err.msg]);
              break;
            case 'email':
              setEmailErrors(prevErrors => [...prevErrors, err.msg]);
              break;
            case 'password':
              setPasswordErrors(prevErrors => [...prevErrors, err.msg]);
              break;
            case 'confirmPassword':
              setPasswordConfirmationErrors(prevErrors => [...prevErrors, err.msg]);
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
      case 'name':
        setNameErrors([] as string[]);
        break;
      case 'email':
        setEmailErrors([] as string[]);
        break;
      case 'password':
        setPasswordErrors([] as string[]);
        break;
      case 'confirmPassword':
        setPasswordConfirmationErrors([] as string[]);
        break;
      default:
        break;
    }
  };

  const handleModalOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    // Set isSignedIn to false when modal is closed
    if (!isOpen) {
      setIsSignedIn(false);
      clearForm();
    }
  };
  
  const clearForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setNameErrors([]);
    setEmailErrors([]);
    setPasswordErrors([]);
    setPasswordConfirmationErrors([]);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={handleModalOpenChange}
        placement="center"
        className='max-h-[35rem] min-h-[28rem]'
        backdrop='blur'
      >
        <ModalContent>
          <div className='flex flex-col justify-center h-full'>
            {isSignedIn ? (
              <div className='flex flex-col my-[50%] items-center justify-center h-full'>
                <CheckCircle className="mb-2 text-green-500" size={48} />
                <p className="text-2xl font-semibold text-green-500">Signed up Successfully</p>
              </div>) :
              (isLoading ?
                <Spinner className='my-[50%]' size="lg" /> :
                <form onSubmit={handleSubmit}>
                  <ModalHeader className="flex flex-col gap-1">Sign up</ModalHeader>
                  <ModalBody className='flex flex-col gap-4'>
                    <div className="flex flex-col space-y-1">
                      <Input
                        name="name"
                        value={name}
                        label="Name"
                        placeholder="Enter your Name"
                        variant="bordered"
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => handleInputFocus('name')} // Clear name error on focus
                        required
                      />
                      {nameErrors && <span className="flex flex-col ml-5 text-sm text-red-700 ml-">{nameErrors.map(error => (
                        <ul key={error} className=''>
                          <li className='list-disc'>{error}</li>
                        </ul>
                      ))}</span>}
                    </div>

                    <div className="flex flex-col space-y-1">
                      <Input
                        name="email"
                        value={email}
                        label="Email"
                        placeholder="Enter your Email"
                        variant="bordered"
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => handleInputFocus('email')} // Clear email error on focus
                        required
                      />
                      {emailErrors && <span className="flex flex-col ml-5 text-sm text-red-700">{emailErrors.map(error => (
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

                    <div className="flex flex-col space-y-1">
                      <Input
                        name="confirmPassword"
                        value={confirmPassword}
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        type="password"
                        variant="bordered"
                        onChange={(e) => setConfirmPassword(e.target.value)} // Update confirmPassword state
                        onFocus={() => handleInputFocus('confirmPassword')}
                        required
                      />

                      {passwordConfirmationErrors && <span className="flex flex-col ml-5 text-sm text-red-700">{passwordConfirmationErrors.map(error => (
                        <ul key={error} className=''>
                          <li className='list-disc'>{error}</li>
                        </ul>
                      ))}</span>}
                    </div>
                  </ModalBody>
                  <ModalFooter className="flex justify-center w-full">

                    <Button className="w-full" color="primary" type="submit">
                      Sign up
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
