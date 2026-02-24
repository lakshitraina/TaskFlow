import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
    const [members, setMembers] = useState([]);

    // Fetch team members from backend on mount
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch('/api/users');
                if (!response.ok) throw new Error('Failed to fetch team members');
                const data = await response.json();
                setMembers(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching team members:', error);
                toast.error('Failed to load team from server');
            }
        };
        fetchMembers();
    }, []);

    const addMember = async (member) => {
        try {
            const memberData = {
                ...member,
                status: 'Active',
            };
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(memberData),
            });
            if (!response.ok) throw new Error('Failed to add member');
            const newMember = await response.json();

            setMembers((prev) => [...prev, newMember]);
            toast.success(`${member.name} added to the team`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to add team member');
        }
    };

    const inviteMember = async (data) => {
        try {
            const memberData = {
                ...data,
                avatar: '',
                status: 'Invited',
            };
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(memberData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                // Check if it's a MongoDB duplicate key error (code 11000)
                if (errorData.message && errorData.message.includes('E11000')) {
                    throw new Error('This email address is already in the team!');
                }
                throw new Error(errorData.message || 'Failed to invite member');
            }

            const newMember = await response.json();

            setMembers((prev) => [...prev, newMember]);
            toast.success(`Invitation sent to ${data.email}`);
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Failed to send invitation');
        }
    };

    const resendInvite = (id) => {
        const member = members.find((m) => m.id === id);
        if (member) {
            toast.success(`Invitation resent to ${member.email}`);
        }
    };

    const updateMember = async (id, updatedFields) => {
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedFields),
            });
            if (!response.ok) throw new Error('Failed to update member');
            const updatedMember = await response.json();

            setMembers((prev) =>
                prev.map((m) => (m.id === id ? { ...m, ...updatedMember } : m))
            );
            toast.success('Team member updated');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update team member');
        }
    };

    const deleteMember = async (id) => {
        try {
            const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to remove member');

            setMembers((prev) => prev.filter((m) => m.id !== id));
            toast.success('Team member removed');
        } catch (error) {
            console.error(error);
            toast.error('Failed to remove team member');
        }
    };

    const getMemberById = (id) => {
        return members.find(m => m.id === id);
    };

    return (
        <TeamContext.Provider
            value={{
                members,
                addMember,
                inviteMember,
                resendInvite,
                updateMember,
                deleteMember,
                getMemberById
            }}
        >
            {children}
        </TeamContext.Provider>
    );
};

export const useTeam = () => {
    const context = useContext(TeamContext);
    if (!context) {
        throw new Error('useTeam must be used within a TeamProvider');
    }
    return context;
};
