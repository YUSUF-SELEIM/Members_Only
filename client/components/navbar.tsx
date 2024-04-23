'use client';
import { Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, useDisclosure } from "@nextui-org/react";
import NextLink from "next/link";
import { ThemeSwitch } from "@/components/theme-switch";
import {
    GithubIcon,
} from "@/components/icons";
import { Logo } from "@/components/icons";
import { Button } from "@nextui-org/button";
import { Login } from "@/components/loginModal";
import { Signup } from "@/components/signupModal";


export const Navbar = ({ setIsLoggedIn }: { setIsLoggedIn: (isLoggedIn: boolean) => void; }) => {
    const { onOpen: onLoginOpen, isOpen: isLoginOpen, onOpenChange: onLoginOpenChange } = useDisclosure();
    const { onOpen: onSignupOpen, isOpen: isSignupOpen, onOpenChange: onSignupOpenChange } = useDisclosure();
    return (
        <NextUINavbar className="justify-center w-full">
            <NavbarContent className="flex justify-between w-full gap-4">
                <NavbarBrand>
                    <NextLink className="flex items-center justify-start gap-1" href="/">
                        <Logo />
                        <p className="font-bold text-inherit">MembersOnly</p>
                    </NextLink>
                </NavbarBrand>


                <NavbarItem className="flex gap-2">
                    <Link isExternal href="" aria-label="Github">
                        <GithubIcon className="text-default-500" />
                    </Link>
                    <ThemeSwitch />
                </NavbarItem>

                <NavbarItem>
                    <Button onPress={onLoginOpen} color="primary" variant="ghost">
                        Login
                    </Button>
                    <Login setIsLoggedIn={setIsLoggedIn} isOpen={isLoginOpen} onOpenChange={onLoginOpenChange} />
                </NavbarItem>
                <NavbarItem>
                    <Button onPress={onSignupOpen}  color="primary" variant="ghost">
                        Sign up
                    </Button>
                    <Signup isOpen={isSignupOpen} onOpenChange={onSignupOpenChange} />
                </NavbarItem>

                <Dropdown placement="bottom-start">
                    <DropdownTrigger>
                        <Avatar
                            isBordered
                            as="button"
                            className="transition-transform"
                            color="secondary"
                            name="Jason Hughes"
                            size="sm"
                            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="profile" className="gap-2 h-14">
                            <p className="font-semibold">Signed in as</p>
                            <p className="font-semibold">zoey@example.com</p>
                        </DropdownItem>
                        <DropdownItem key="logout" color="danger">
                            Log Out
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </NextUINavbar>
    );
};
