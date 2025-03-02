// AdminPanel Component
const { useState, useEffect } = window.React;

function AdminPanel({ 
  challenges, 
  setChallenges, 
  participants, 
  setParticipants, 
  userChallenges, 
  setUserChallenges,
  onReturn
}) {
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    days: 7,
    startDate: new Date(2025, 1, 27).toISOString().split('T')[0],
    active: true,
    participants: 0,
    rewards: {
      completion: "",
      streak: "",
      social: ""
    }
  });
  const [adminFilter, setAdminFilter] = useState('all'); // 'all', 'active', 'upcoming'

  // Update challenge
  const updateChallenge = () => {
    if (!editingChallenge) return;
    
    const updatedChallenges = challenges.map(c => 
      c.id === editingChallenge.id ? {
        ...editingChallenge,
        startDate: new Date(editingChallenge.startDate)
      } : c
    );
    
    setChallenges(updatedChallenges);
    
    // Update user challenges if necessary
    if (userChallenges.some(uc => uc.id === editingChallenge.id)) {
      const updatedUserChallenges = userChallenges.map(uc => 
        uc.id === editingChallenge.id ? {
          ...uc,
          title: editingChallenge.title,
          days: editingChallenge.days,
          startDate: new Date(editingChallenge.startDate),
          rewards: editingChallenge.rewards
        } : uc
      );
      
      setUserChallenges(updatedUserChallenges);
    }
    
    setEditingChallenge(null);
  };

  // Delete challenge
  const deleteChallenge = (id) => {
    if (window.confirm('确定要删除这个挑战吗？这将删除所有相关数据，且无法恢复。')) {
      setChallenges(challenges.filter(c => c.id !== id));
      setUserChallenges(userChallenges.filter(c => c.id !== id));
      
      const newParticipants = {...participants};
      delete newParticipants[id];
      setParticipants(newParticipants);
    }
  };

  // Add new challenge
  const addChallenge = () => {
    if (!newChallenge.title || newChallenge.days < 1) return;
    
    const newId = Math.max(...challenges.map(c => c.id), 0) + 1;
    
    const createdChallenge = {
      ...newChallenge,
      id: newId,
      startDate: new Date(newChallenge.startDate),
      participants: parseInt(newChallenge.participants) || 0
    };
    
    setChallenges([...challenges, createdChallenge]);
    
    // Initialize participants data
    const newParticipantsData = {...participants};
    newParticipantsData[newId] = {
      users: [],
      checkIns: {}
    };
    
    // Generate random participants if specified
    if (createdChallenge.participants > 0) {
      const users = [];
      
      for (let i = 1; i <= createdChallenge.participants; i++) {
        const user = {
          id: i,
          name: `用户${i}`,
          avatar: `https://ui-avatars.com/api/?name=用户${i}&background=random`,
          level: Math.floor(Math.random() * 10) + 1,
          streak: Math.floor(Math.random() * 30) + 1
        };
        users.push(user);
      }
      
      newParticipantsData[newId].users = users;
    }
    
    setParticipants(newParticipantsData);
    setShowAddModal(false);
    setNewChallenge({
      title: "",
      days: 7,
      startDate: new Date(2025, 1, 27).toISOString().split('T')[0],
      active: true,
      participants: 0,
      rewards: {
        completion: "",
        streak: "",
        social: ""
      }
    });
  };

  // Filter challenges based on status
  const filteredChallenges = challenges.filter(challenge => {
    const today = new Date(2025, 1, 27); // Feb 27, 2025
    if (adminFilter === 'all') return true;
    if (adminFilter === 'active' && challenge.active) return true;
    if (adminFilter === 'upcoming' && !challenge.active) return true;
    return false;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-primary">管理后台</h1>
            <p className="text-lg text-gray-600">管理挑战数据和用户信息</p>
          </div>
          <button 
            onClick={onReturn}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            返回用户界面
          </button>
        </div>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button 
              onClick={() => setAdminFilter('all')}
              className={`px-4 py-2 rounded-lg ${adminFilter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
            >
              全部挑战
            </button>
            <button 
              onClick={() => setAdminFilter('active')}
              className={`px-4 py-2 rounded-lg ${adminFilter === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
            >
              活跃挑战
            </button>
            <button 
              onClick={() => setAdminFilter('upcoming')}
              className={`px-4 py-2 rounded-lg ${adminFilter === 'upcoming' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}
            >
              即将开始
            </button>
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            添加新挑战
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">挑战名称</th>
                <th className="py-3 px-4 text-left">天数</th>
                <th className="py-3 px-4 text-left">参与人数</th>
                <th className="py-3 px-4 text-left">开始日期</th>
                <th className="py-3 px-4 text-left">状态</th>
                <th className="py-3 px-4 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredChallenges.map(challenge => (
                <tr key={challenge.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{challenge.id}</td>
                  <td className="py-3 px-4 font-medium">{challenge.title}</td>
                  <td className="py-3 px-4">{challenge.days}天</td>
                  <td className="py-3 px-4">{challenge.participants}人</td>
                  <td className="py-3 px-4">{challenge.startDate.toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${challenge.active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {challenge.active ? '进行中' : '即将开始'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setEditingChallenge({
                          ...challenge,
                          startDate: challenge.startDate.toISOString().split('T')[0]
                        })}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        编辑
                      </button>
                      <button 
                        onClick={() => deleteChallenge(challenge.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredChallenges.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            没有找到符合条件的挑战
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">数据概览</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">总挑战数</h3>
            <p className="text-3xl font-bold text-blue-700">{challenges.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">活跃挑战</h3>
            <p className="text-3xl font-bold text-green-700">{challenges.filter(c => c.active).length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">总参与用户</h3>
            <p className="text-3xl font-bold text-purple-700">
              {Object.values(participants).reduce((total, p) => total + p.users.length, 0)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Edit Challenge Modal */}
      {editingChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full animate-bounce-in">
            <h3 className="text-2xl font-bold mb-4">编辑挑战</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">挑战名称</label>
              <input 
                type="text" 
                value={editingChallenge.title}
                onChange={(e) => setEditingChallenge({...editingChallenge, title: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">持续天数</label>
              <input 
                type="number" 
                min="1"
                value={editingChallenge.days}
                onChange={(e) => setEditingChallenge({...editingChallenge, days: parseInt(e.target.value) || 7})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">开始日期</label>
              <input 
                type="date" 
                value={editingChallenge.startDate}
                onChange={(e) => setEditingChallenge({...editingChallenge, startDate: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">状态</label>
              <select
                value={editingChallenge.active ? "active" : "upcoming"}
                onChange={(e) => setEditingChallenge({...editingChallenge, active: e.target.value === "active"})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="active">活跃</option>
                <option value="upcoming">即将开始</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">完成奖励</label>
              <input 
                type="text" 
                value={editingChallenge.rewards.completion}
                onChange={(e) => setEditingChallenge({
                  ...editingChallenge, 
                  rewards: {...editingChallenge.rewards, completion: e.target.value}
                })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">连续奖励</label>
              <input 
                type="text" 
                value={editingChallenge.rewards.streak}
                onChange={(e) => setEditingChallenge({
                  ...editingChallenge, 
                  rewards: {...editingChallenge.rewards, streak: e.target.value}
                })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">社交奖励</label>
              <input 
                type="text" 
                value={editingChallenge.rewards.social}
                onChange={(e) => setEditingChallenge({
                  ...editingChallenge, 
                  rewards: {...editingChallenge.rewards, social: e.target.value}
                })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button 
                onClick={() => setEditingChallenge(null)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={updateChallenge}
                className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Challenge Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full animate-bounce-in">
            <h3 className="text-2xl font-bold mb-4">添加新挑战</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">挑战名称</label>
              <input 
                type="text" 
                value={newChallenge.title}
                onChange={(e) => setNewChallenge({...newChallenge, title: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="例：7天辟谷挑战第X期"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">持续天数</label>
              <input 
                type="number" 
                min="1"
                value={newChallenge.days}
                onChange={(e) => setNewChallenge({...newChallenge, days: parseInt(e.target.value) || 7})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">开始日期</label>
              <input 
                type="date" 
                value={newChallenge.startDate}
                onChange={(e) => setNewChallenge({...newChallenge, startDate: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">状态</label>
              <select
                value={newChallenge.active ? "active" : "upcoming"}
                onChange={(e) => setNewChallenge({...newChallenge, active: e.target.value === "active"})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="active">活跃</option>
                <option value="upcoming">即将开始</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">初始参与人数</label>
              <input 
                type="number" 
                min="0"
                value={newChallenge.participants}
                onChange={(e) => setNewChallenge({...newChallenge, participants: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="自动生成的随机参与者数量"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">完成奖励</label>
              <input 
                type="text" 
                value={newChallenge.rewards.completion}
                onChange={(e) => setNewChallenge({
                  ...newChallenge, 
                  rewards: {...newChallenge.rewards, completion: e.target.value}
                })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="例：辟谷达人勋章"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">连续奖励</label>
              <input 
                type="text" 
                value={newChallenge.rewards.streak}
                onChange={(e) => setNewChallenge({
                  ...newChallenge, 
                  rewards: {...newChallenge.rewards, streak: e.target.value}
                })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="例：坚持不懈徽章"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">社交奖励</label>
              <input 
                type="text" 
                value={newChallenge.rewards.social}
                onChange={(e) => setNewChallenge({
                  ...newChallenge, 
                  rewards: {...newChallenge.rewards, social: e.target.value}
                })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="例：分享达人标识"
              />
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={addChallenge}
                disabled={!newChallenge.title || newChallenge.days < 1}
                className={`flex-1 px-4 py-2 rounded-lg text-white ${
                  !newChallenge.title || newChallenge.days < 1 
                    ? 'bg-gray-400' 
                    : 'bg-primary hover:bg-blue-600 transition-colors'
                }`}
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Make AdminPanel available globally
window.AdminPanel = AdminPanel;
