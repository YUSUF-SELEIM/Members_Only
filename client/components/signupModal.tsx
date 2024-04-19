'use client';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";

export const Signup = ({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) => {
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
                            <ModalHeader className="flex flex-col gap-1">Sign up</ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus

                                    label="Name"
                                    placeholder="Enter your Name"
                                    variant="bordered"
                                />
                                <Input
                                    label="Email"
                                    placeholder="Enter your Email"
                                    variant="bordered"
                                />
                                <Input

                                    label="Password"
                                    placeholder="Enter your password"
                                    type="password"
                                    variant="bordered"
                                />
                                <Input

                                    label="Confirm Password"
                                    placeholder="Enter your password again"
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
