import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLoaderData } from '@remix-run/react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const { user } = useLoaderData();
	const [currentUser, setCurrentUser] = useState(user);

	useEffect(() => {
		setCurrentUser(user);
	}, [user]);

	return <UserContext.Provider value={{ currentUser, setCurrentUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
	return useContext(UserContext);
};
