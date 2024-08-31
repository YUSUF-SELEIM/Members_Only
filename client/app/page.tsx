'use client';
import axios from 'axios';
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button, Spinner, useDisclosure } from "@nextui-org/react";
import { Login } from "@/components/loginModal";
import { Signup } from "@/components/signupModal";
import Posts from "@/components/Posts";

export default function Home() {
	const [userData, setUserData] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Function to fetch user data from the server
		const fetchUserData = async () => {
			try {
				// Set the request configuration
				const config = {
					method: 'get',
					url: `${process.env.NEXT_PUBLIC_BACK_END_URL}/api/user`,
					withCredentials: true, // Include credentials for session authentication
				};

				// Send the request to fetch user data
				// add an interface in here for that response object
				const response = await axios(config);

				// Check if the response is successful
				if (response.status === 200) {
					// Extract the user data from the response and set it in state
					setUserData(response.data);
					setIsLoggedIn(true);
					console.log('User data:', response.data);
				} else {
					// Handle unexpected response status
					console.error('Unexpected response status:', response.status);
				}
			} catch (error) {
				// Handle any errors that occur during the request
				console.error('Error fetching user data:', error);
			} finally {
				setIsLoading(false);
			}
		};

		// Fetch user data when the component renders if there is an active session
		fetchUserData();

		// Fetch user data again if the user is logged in
		if (isLoggedIn) {
			fetchUserData();
		}
	}, [isLoggedIn]); // Run this effect when the isLoggedIn state changes
	const { onOpen: onLoginOpen, isOpen: isLoginOpen, onOpenChange: onLoginOpenChange } = useDisclosure();
	const { onOpen: onSignupOpen, isOpen: isSignupOpen, onOpenChange: onSignupOpenChange } = useDisclosure();

	return (
		<div className="flex flex-col items-center justify-center w-full h-full">
			{isLoading ? <Spinner size="lg" /> :
				(
					<div className="flex flex-col items-center justify-between w-full h-full">
						<Navbar userData={userData} isLoggedIn={isLoggedIn} />
						<main className="flex flex-col items-center justify-between w-full h-full md:flex-row ">
							{!isLoggedIn && (
								<div className="flex flex-col items-center justify-center w-full mt-32 mb-32 space-y-4 md:h-full space-y- md:mt-0">
									<h1 className="text-4xl font-bold text-center">Welcome to Members<span className='text-blue-700'>Only</span></h1>
									<p className="text-lg text-center">
										An exclusive community for members only
										<br />
									</p>
									<div className="flex space-x-2">
										<Button onPress={onLoginOpen} color="primary" variant="ghost">
											Login
										</Button>
										<Button onPress={onSignupOpen} color="primary" variant="ghost">
											Sign up
										</Button>
									</div>
									<Login setIsLoggedIn={setIsLoggedIn} isOpen={isLoginOpen} onOpenChange={onLoginOpenChange} />
									<Signup isOpen={isSignupOpen} onOpenChange={onSignupOpenChange} />
								</div>
							)}
							<div className="flex flex-col items-center justify-between w-full h-full">
								<Posts isLoggedIn={isLoggedIn}/>
							</div>
						</main>
					</div>
				)}
		</div>
	);
}
