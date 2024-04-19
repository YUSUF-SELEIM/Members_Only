'use client';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input} from "@nextui-org/react";

export const Login = ({isOpen, onOpenChange}: {isOpen: boolean, onOpenChange: (isOpen: boolean) => void}) => {
  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
      
                  label="Email"
                  placeholder="Enter your email"
                  variant="bordered"
                />
                <Input
      
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter className="w-full">
                <Button className="w-full" color="primary" onPress={onClose}>
                  Log in
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
