'use client';
import Footer from "@/components/footer";
import axios from 'axios';
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";

export default function Home() {
	const [userData, setUserData] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	useEffect(() => {
		// Function to fetch user data from the server
		const fetchUserData = async () => {
			try {
				// Set the request configuration
				const config = {
					method: 'get',
					url: `http://localhost:3000/api/user/`,
					withCredentials: true, // Include credentials for session authentication
				};

				// Send the request to fetch user data
				const response = await axios(config);

				// Check if the response is successful
				if (response.status === 200) {
					// Extract the user data from the response and set it in state
					setUserData(response.data);
					console.log('User data:', response.data);
				} else {
					// Handle unexpected response status
					console.error('Unexpected response status:', response.status);
				}
			} catch (error) {
				// Handle any errors that occur during the request
				console.error('Error fetching user data:', error);
			}
		};

		// Fetch user data when the component renders
		fetchUserData();

		// Fetch user data again if the user is logged in
		if (isLoggedIn) {
			fetchUserData();
		}
	}, [isLoggedIn]); // Run this effect when the isLoggedIn state changes


	return (
		<>
			<Navbar setIsLoggedIn={setIsLoggedIn} />
			<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
				<main className="flex flex-col items-center justify-center w-full gap-4 px-6">
					<h1 className="text-4xl font-bold text-center">Welcome to MembersOnly</h1>
					<p className="text-lg text-center">
						An exclusive community for members only
						<br />
						{/* Display the user's name if available, otherwise, display 'Guest' */}
						Welcome back, {userData?.name ?? 'Guest'}!
					</p>
				</main>
				<Footer />
			</section>
		</>
	);
}
