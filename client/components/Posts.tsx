import React, { useState, useEffect } from 'react';
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card";
import { Pagination } from "@nextui-org/pagination";
import { User } from "@nextui-org/user";
import io from 'socket.io-client';
import { Spinner, Divider } from '@nextui-org/react';

interface Post {
  id: string;
  creatorName: string;
  creatorEmail: string;
  post: string;
  dateCreated: Date;
}

const Posts = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [serverTime, setServerTime] = useState(new Date());
  const [paginationClicks, setPaginationClicks] = useState(0); // Track pagination clicks
  const itemsPerPage = 2;

  useEffect(() => {
    const socket = io('https://membersonly-production-4ea6.up.railway.app', { transports: ['websocket', 'polling', 'flashsocket'] });

    // Listen for the 'newPost' event from the server
    socket.on('newPost', (newPost) => {
      // Update the posts state with the new post
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    });
    socket.on('serverTime', (time) => {
      setServerTime(new Date(time));
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch data from the fake JSON API
        const response = await fetch('https://membersonly-production-4ea6.up.railway.app/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate index of the first and last item of the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Slice the messages array to get the items for the current page
  const currentItems = posts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    console.log('Page changed:', page);
    setCurrentPage(page);
    setPaginationClicks((prevClicks) => prevClicks + 1);
  };
  const getTimeAgo = (dateCreated: string | number | Date) => {
    const postTime = new Date(dateCreated).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - postTime;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 1) {
      // Display the date in YYYY-MM-DD format
      return new Date(dateCreated).toISOString().split('T')[0];
    } else if (hours >= 24) {
      // Display "One day ago" if more than 24 hours ago
      return 'One day ago';
    } else if (hours > 0) {
      // Display hours ago
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      // Display minutes ago
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      // Display "Just now" if less than a minute ago
      return 'Just now';
    }
  };

  return (
    <div className='flex flex-col items-center justify-between h-full '>
      <div className='flex flex-col justify-center items-center md:h-[70vh] h-full w-full space-y-4'>
        {isLoading ? <Spinner className='my-auto' size="lg" /> :
          <div className='md:mt-8'>
            {currentItems.map(post => (
              <CardContainer key={post.id} className="max-w-[40rem] md:w-[35rem] w-[22rem] md:h-[35vh] h-[14rem] px-4 md:p-3 p-2">
                <CardBody className="w-full flex flex-col space-y-4 md:p-5 p-2 py-5 relative hover:shadow-lg dark:hover:shadow-2xl h-full text-foreground box-border bg-content1 outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large transition-transform-background motion-reduce:transition-none">
                  <CardItem className="flex items-center justify-between w-full md:px-3">
                    <User
                      name={post.creatorName}
                      description={isLoggedIn ? post.creatorEmail : 'Member'}
                    />
                    <div className="md:text-sm italic text-[12px]">
                      <p>{getTimeAgo(post.dateCreated)}</p>
                    </div>
                  </CardItem>
                  <Divider />
                  <CardItem className='w-full overflow-auto overflow-x-hidden'>
                    {!isLoggedIn ? <p className='blur-sm'><div id='editor' dangerouslySetInnerHTML={{ __html: post.post }} /></p> :
                      <div id='editor' dangerouslySetInnerHTML={{ __html: post.post }} />
                    }
                  </CardItem>
                </CardBody>
              </CardContainer>
            ))}
          </div>
        }
      </div>
      <div className='flex flex-col justify-end md:pb-4'>
        <Pagination
          total={Math.ceil(posts.length / itemsPerPage)}
          onChange={handlePageChange} // Use the onClick event to handle page changes
          initialPage={1}
          defaultValue={1}
          defaultChecked
        />
      </div>
    </div>

  );
};

export default Posts;
