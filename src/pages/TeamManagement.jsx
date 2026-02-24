import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import TeamList from '../components/team/TeamList';
import TeamMemberForm from '../components/team/TeamMemberForm';
import AssignTaskModal from '../components/team/AssignTaskModal';
import InviteMemberModal from '../components/team/InviteMemberModal';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { Plus, Users, Mail } from 'lucide-react';
import { useTeam } from '../context/TeamContext';
import TeamKPIBar from '../components/team/TeamKPIBar';

const TeamManagement = () => {
    const { members, addMember, updateMember, deleteMember, inviteMember, resendInvite } = useTeam();
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [editingMember, setEditingMember] = useState(null);

    const handleCreateMember = () => {
        setEditingMember(null);
        setIsMemberModalOpen(true);
    };

    const handleInviteMember = () => {
        setIsInviteModalOpen(true);
    };

    const handleEditMember = (member) => {
        setEditingMember(member);
        setIsMemberModalOpen(true);
    };

    const handleDeleteMember = (id) => {
        if (window.confirm('Are you sure you want to remove this team member?')) {
            deleteMember(id);
        }
    };

    const handleAssignTask = (member) => {
        setSelectedMember(member);
        setIsAssignModalOpen(true);
    };

    const handleMemberSubmit = (data) => {
        if (editingMember) {
            updateMember(editingMember.id, data);
        } else {
            addMember(data);
        }
    };

    const handleInviteSubmit = (data) => {
        inviteMember(data);
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 w-full">
                {/* Left - Title & Subtitle */}
                <div className="flex-1 w-full text-center md:text-left">
                    <h1 className="text-[32px] font-black tracking-tight text-zinc-900 mb-1 leading-none">Team Directory</h1>
                    <p className="text-[15px] font-medium text-pw-muted">
                        Manage your members and assign workflow resources.
                    </p>
                </div>

                {/* Right - Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-3 w-full md:w-auto">
                    <button
                        onClick={handleInviteMember}
                        className="bg-white hover:bg-pw-pill-bg border border-pw-border text-pw-text px-5 py-2.5 rounded-full font-bold text-[14px] flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                        <Mail className="h-4 w-4" />
                        Invite People
                    </button>
                    <button
                        onClick={handleCreateMember}
                        className="bg-pw-green hover:bg-[#0da672] text-white px-6 py-2.5 rounded-full font-bold text-[14px] flex items-center justify-center gap-2 transition-all shadow-[0_4px_16px_rgba(14,183,129,0.2)] hover:shadow-[0_8px_24px_rgba(14,183,129,0.3)] hover:-translate-y-0.5"
                    >
                        <Plus className="h-5 w-5 stroke-[2.5px]" />
                        New Member
                    </button>
                </div>
            </div>

            {/* New KPI Stats Bar */}
            <TeamKPIBar />

            <TeamList
                members={members}
                onEdit={handleEditMember}
                onDelete={handleDeleteMember}
                onAssignTask={handleAssignTask}
                onResendInvite={resendInvite}
            />

            <Modal
                isOpen={isMemberModalOpen}
                onClose={() => setIsMemberModalOpen(false)}
                title={editingMember ? 'Edit Team Member' : 'Add New Team Member'}
            >
                <TeamMemberForm
                    onClose={() => setIsMemberModalOpen(false)}
                    onSubmit={handleMemberSubmit}
                    initialData={editingMember}
                />
            </Modal>

            <Modal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                title="Invite New Member"
            >
                <InviteMemberModal
                    onClose={() => setIsInviteModalOpen(false)}
                    onInvite={handleInviteSubmit}
                />
            </Modal>

            {selectedMember && (
                <AssignTaskModal
                    isOpen={isAssignModalOpen}
                    onClose={() => {
                        setIsAssignModalOpen(false);
                        setSelectedMember(null);
                    }}
                    member={selectedMember}
                />
            )}
        </DashboardLayout>
    );
};

export default TeamManagement;
