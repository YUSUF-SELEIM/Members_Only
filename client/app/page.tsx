'use client';
import Footer from "@/components/footer";
import axios from 'axios';
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";

export default function Home() {
	const [userData, setUserData] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				// Get the user's cookie from the browser
				const userCookie = document.cookie;
				console.log(userCookie);
	
				// Set the request configuration
				const config = {
					method: 'get',
					url: `http://localhost:3000/api/user/`,
					withCredentials: true, // Include credentials for session authentication
					headers: {
						'Content-Type': 'application/json',
						"Accept": "/",
						"Cache-Control": "no-cache",
						'Cookie': 'connect.sid=s%3Aq801cNDQ46Fq8i14WBUhiRp0W9Z1Byk3.9cAqbTSAgZBWVhF4kAi2WU6eaFySZyNvqRkNmhnpZUY'					},	
				};
	
				// Send the request
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
	
		// Check if user is logged in (you can use a state variable like isLoggedIn)
		if (isLoggedIn) {
			fetchUserData(); // Fetch user data if user is logged in
		}
	}, [isLoggedIn]); // Include 'isLoggedIn' in the dependency array
	
	return (
		<>
		 <Navbar setIsLoggedIn={setIsLoggedIn}/>
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<main className="flex flex-col items-center justify-center w-full gap-4 px-6">
				<h1 className="text-4xl font-bold text-center">Welcome to MembersOnly</h1>
				<p className="text-lg text-center">
					An exclusive community for members only
					<br />
					Welcome back, {userData?.name ?? 'Guest'}!
				</p>
			</main>
			<Footer />
		</section>
		</>
	);
}
