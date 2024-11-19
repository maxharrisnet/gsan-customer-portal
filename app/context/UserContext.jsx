import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children, initialUser }) => {
	const [currentUser, setCurrentUser] = useState(initialUser);

	useEffect(() => {
		setCurrentUser(initialUser);
	}, [initialUser]);

	return <UserContext.Provider value={{ currentUser, setCurrentUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
	return useContext(UserContext);
};
