import { Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, useDisclosure } from "@nextui-org/react";
import NextLink from "next/link";
import { ThemeSwitch } from "@/components/theme-switch";
import {
    GithubIcon,
} from "@/components/icons";
import { Logo } from "@/components/icons";
import axios from 'axios';
import { Post } from "./postModal";


export const Navbar = ({ userData, isLoggedIn }: { userData: any; isLoggedIn: boolean; }) => {
    const { onOpen, isOpen, onOpenChange } = useDisclosure();

    const handleLogout = async () => {
        try {
            // Make a POST request to logout endpoint
            const response = await axios.delete('http://localhost:3000/api/log-out', {
                withCredentials: true,
            });

            // Check if the logout was successful
            if (response.status === 200) {
                console.log('Logout successful');
                window.location.reload();
            } else {
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

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
                {isLoggedIn && (
                    <Dropdown placement="bottom-start">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform"
                                color="secondary"
                                name="Jason Hughes"
                                size="sm"
                                src={`https://avatar.iran.liara.run/username?username=${userData?.name}`}
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="profile" className="gap-2 h-14">
                                <p className="font-semibold">Signed in as</p>
                                <p className="font-semibold">{userData?.email}</p>
                            </DropdownItem>
                            <DropdownItem key="logout" color="success" onClick={onOpen}>
                                New Post
                            </DropdownItem>
                            <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                )}
                <Post userData={userData} isOpen={isOpen} onOpenChange={onOpenChange} />
            </NavbarContent>
        </NextUINavbar>
    );
};
