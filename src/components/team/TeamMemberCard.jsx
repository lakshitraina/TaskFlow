import React from 'react';
import { MoreVertical, Mail, Shield, User } from 'lucide-react';
import Button from '../ui/Button';

const TeamMemberCard = ({ member, onEdit, onDelete, onAssignTask, onResendInvite }) => {
    const isInvited = member.status === 'Invited';

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow relative overflow-hidden">
            {isInvited && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Invited
                </div>
            )}

            <div className="relative w-24 h-24 mb-4">
                {member.avatar ? (
                    <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover border-4 border-gray-50 dark:border-gray-700 shadow-sm"
                    />
                ) : (
                    <div className="w-full h-full rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-4 border-gray-50 dark:border-gray-700">
                        <User className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                    </div>
                )}
                {!isInvited && (
                    <span className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${member.role === 'Admin' ? 'bg-purple-500' :
                            member.role === 'Manager' ? 'bg-blue-500' : 'bg-green-500'
                        }`}></span>
                )}
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>

            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <Shield className="h-3.5 w-3.5" />
                <span>{member.role}</span>
            </div>

            <div className="w-full border-t border-gray-100 dark:border-gray-700 pt-4 mt-auto">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4 overflow-hidden">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{member.email}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {isInvited ? (
                        <Button
                            size="sm"
                            variant="secondary"
                            className="w-full text-xs col-span-2"
                            onClick={() => onResendInvite(member.id)}
                        >
                            Resend Invite
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="w-full text-xs"
                                onClick={() => onEdit(member)}
                            >
                                Edit
                            </Button>
                            <Button
                                size="sm"
                                className="w-full text-xs"
                                onClick={() => onAssignTask(member)}
                            >
                                Assign Task
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamMemberCard;
