import React from 'react';
import TeamMemberCard from './TeamMemberCard';
import { Users } from 'lucide-react';

const TeamList = ({ members, onEdit, onDelete, onAssignTask, onResendInvite }) => {
    if (!members.length) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No Team Members Found</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
                    Get started by adding your first team member to collaborate on tasks.
                </p>
                {/* Button would typically go here, but is handled by parent page */}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {members.map((member) => (
                <TeamMemberCard
                    key={member.id}
                    member={member}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAssignTask={onAssignTask}
                    onResendInvite={onResendInvite}
                />
            ))}
        </div>
    );
};

export default TeamList;
