import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { createInvite } from '../authedApi';
import { Link } from 'react-router-dom';

function Invite() {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [familyId, setFamilyId] = useState(null);

  useEffect(() => {
    const storedFamilyId = localStorage.getItem('familyId');
    if (storedFamilyId) {
      setFamilyId(storedFamilyId);
    }
  }, []);

  const handleCreateInvite = async () => {
    if (!familyId) {
      setError('You must create a family before you can invite members.');
      return;
    }

    setLoading(true);
    setError('');
    setInviteLink('');

    try {
      const response = await createInvite(familyId, { maxUses: 5 });
      const inviteCode = response.data.code;
      const newInviteLink = `${window.location.origin}/accept-invite/${inviteCode}`;
      setInviteLink(newInviteLink);
    } catch (err) {
      setError('Failed to create invite. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!familyId) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg text-center">
          <h1 className="text-2xl font-bold mb-4">No Family Found</h1>
          <p className="mb-6">You need to create a family before you can invite members.</p>
          <Link to="/create-family" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Create a Family
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-6">Invite Family Members</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg">
        <p className="mb-4">Click the button below to generate an invite link. Share this link with family members to let them join your family hearth.</p>
        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleCreateInvite}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Invite Link'}
          </button>
        </div>
        {inviteLink && (
          <div className="mt-6 p-4 bg-gray-200 rounded">
            <p className="font-bold">Your invite link is:</p>
            <a href={inviteLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 break-all">{inviteLink}</a>
            <p className="text-sm mt-2">This link can be used 5 times.</p>
          </div>
        )}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export default Invite;
