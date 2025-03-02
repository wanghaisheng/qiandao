// Make React available in module scope
const { useState, useEffect, useRef } = window.React;

// Challenge App Component
function ChallengeApp() {
  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: "7天辟谷挑战第21期",
      days: 7,
      participants: 42,
      startDate: new Date(2025, 1, 23), // Feb 23, 2025
      active: true,
      rewards: {
        completion: "辟谷初学者勋章",
        streak: "坚持不懈徽章",
        social: "分享达人标识"
      }
    },
    {
      id: 2,
      title: "14天辟谷挑战第15期",
      days: 14,
      participants: 28,
      startDate: new Date(2025, 1, 20), // Feb 20, 2025
      active: true,
      rewards: {
        completion: "辟谷大师勋章",
        streak: "意志力超人勋章",
        social: "辟谷影响者认证"
      }
    },
    {
      id: 3,
      title: "7天辟谷挑战第22期",
      days: 7,
      participants: 15,
      startDate: new Date(2025, 2, 5), // Mar 5, 2025
      active: false,
      rewards: {
        completion: "辟谷尝试者勋章",
        streak: "持之以恒徽章",
        social: "健康先驱标识"
      }
    }
  ]);

  const [userChallenges, setUserChallenges] = useState([]);
  const [activeView, setActiveView] = useState('available'); // 'available', 'joined', 'challenge', 'profile', 'create', 'admin', 'aicoach'
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [userStats, setUserStats] = useState({
    totalCheckIns: 0,
    longestStreak: 0,
    challengesCompleted: 0,
    level: 1,
    exp: 0,
    nextLevelExp: 100,
    achievements: [],
    goals: []
  });
  const [showMotivation, setShowMotivation] = useState(false);
  const [motivationMessage, setMotivationMessage] = useState("");
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [rewardEarned, setRewardEarned] = useState(null);
  const [aiCoachMessage, setAiCoachMessage] = useState("");
  const [showAiCoach, setShowAiCoach] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [customGoal, setCustomGoal] = useState({ title: "", days: 7, description: "" });
  
  // Simulated user data
  const [participants, setParticipants] = useState({});
  
  // Motivational quotes
  const motivationalQuotes = [
    "每一次坚持都是对自己最好的投资！",
    "辟谷养生，持之以恒，收获健康人生！",
    "今天的坚持，成就明天更好的自己！",
    "积跬步，至千里，不积小流，无以成江海！",
    "养成好习惯，健康一辈子！",
    "功不唐捐，每一次打卡都在改变你的身体！",
    "坚持辟谷，排毒养颜，焕发活力！",
    "人生没有白走的路，每一步都算数！",
    "坚持到底，等于胜利一半！",
    "与其临渊羡鱼，不如退而结网。现在行动起来！"
  ];
  
  // Add isAdmin state
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [shareImageUrl, setShareImageUrl] = useState(null);
  const [userInsights, setUserInsights] = useState(null);
  const [showMilestones, setShowMilestones] = useState(false);
  const [milestones, setMilestones] = useState([
    { id: 1, title: "第一次打卡", description: "开始你的健康之旅", completed: false, reward: "新手徽章" },
    { id: 2, title: "连续打卡3天", description: "坚持的力量", completed: false, reward: "坚持铜章" },
    { id: 3, title: "连续打卡7天", description: "习惯养成中", completed: false, reward: "习惯银章" },
    { id: 4, title: "完成一个挑战", description: "目标达成者", completed: false, reward: "成就金章" },
    { id: 5, title: "分享进度", description: "传播健康理念", completed: false, reward: "影响力徽章" }
  ]);
  const [dailyTips, setDailyTips] = useState([
    "辟谷期间多喝水，帮助身体排毒",
    "辟谷不等于完全不吃，合理安排轻食更健康",
    "感到头晕时可以适当补充少量果汁",
    "辟谷期间保持心情愉悦，提升效果",
    "辟谷结束后逐步恢复饮食，不要立刻大量进食",
    "辟谷期间适当运动可以加速新陈代谢",
    "每天保持8小时充足睡眠，帮助身体恢复"
  ]);

  useEffect(() => {
    // Simulate loading participants data
    const loadParticipants = () => {
      const data = {};
      challenges.forEach(challenge => {
        const users = [];
        const checkIns = {};
        
        // Generate random participants
        for (let i = 1; i <= challenge.participants; i++) {
          const user = {
            id: i,
            name: `用户${i}`,
            avatar: `https://ui-avatars.com/api/?name=用户${i}&background=random`,
            level: Math.floor(Math.random() * 10) + 1,
            streak: Math.floor(Math.random() * 30) + 1
          };
          users.push(user);
          
          // Generate random check-ins
          const today = new Date(2025, 1, 27); // Feb 27, 2025
          const daysSinceStart = Math.floor((today - challenge.startDate) / (1000 * 60 * 60 * 24));
          
          if (daysSinceStart >= 0 && daysSinceStart < challenge.days) {
            // More users check in early in the challenge, fewer as time goes on
            const checkInProbability = 0.9 - (daysSinceStart * 0.05);
            checkIns[daysSinceStart] = users
              .filter(() => Math.random() < checkInProbability)
              .map(u => u.id);
          }
        }
        
        data[challenge.id] = {
          users,
          checkIns
        };
      });
      setParticipants(data);
    };
    
    loadParticipants();
    
    // Show welcome back message if returning user
    if (userChallenges.length > 0) {
      const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
      setMotivationMessage(randomQuote);
      setShowMotivation(true);
      setTimeout(() => setShowMotivation(false), 5000);
    }
  }, []);

  const joinChallenge = (challenge) => {
    if (!userChallenges.find(c => c.id === challenge.id)) {
      const newUserChallenge = {
        ...challenge,
        joined: new Date(2025, 1, 27), // Feb 27, 2025
        checkIns: {},
        streak: 0,
        points: 0
      };
      setUserChallenges([...userChallenges, newUserChallenge]);
      
      // Add user to participants
      const newParticipants = {...participants};
      const userId = Math.max(...newParticipants[challenge.id].users.map(u => u.id), 0) + 1;
      const newUser = {
        id: userId,
        name: "我",
        avatar: `https://ui-avatars.com/api/?name=我&background=0D8ABC`,
        level: userStats.level,
        streak: userStats.longestStreak
      };
      
      newParticipants[challenge.id].users.push(newUser);
      setParticipants(newParticipants);
      
      // Update challenge participants count
      const updatedChallenges = challenges.map(c => 
        c.id === challenge.id ? {...c, participants: c.participants + 1} : c
      );
      setChallenges(updatedChallenges);
      
      // Show welcome message for new challenge
      setMotivationMessage("太棒了！你已加入挑战，每日坚持打卡，收获健康与成就！");
      setShowMotivation(true);
      setTimeout(() => setShowMotivation(false), 5000);
    }
    
    // Navigate to challenge detail
    setSelectedChallenge(challenge);
    setActiveView('challenge');
  };

  const checkIn = (challengeId) => {
    const today = new Date(2025, 1, 27); // Feb 27, 2025
    const challenge = challenges.find(c => c.id === challengeId);
    const daysSinceStart = Math.floor((today - challenge.startDate) / (1000 * 60 * 60 * 24));
    
    if (daysSinceStart >= 0 && daysSinceStart < challenge.days) {
      // Update user challenges
      const updatedUserChallenges = userChallenges.map(c => {
        if (c.id === challengeId) {
          const updatedCheckIns = {...c.checkIns};
          updatedCheckIns[daysSinceStart] = today;
          
          // Calculate current streak
          let currentStreak = 1;
          let day = daysSinceStart - 1;
          while (day >= 0 && updatedCheckIns[day]) {
            currentStreak++;
            day--;
          }
          
          // Add points for checking in
          const streakBonus = Math.min(currentStreak, 7); // Max 7x bonus
          const earnedPoints = 10 * streakBonus;
          
          return {
            ...c, 
            checkIns: updatedCheckIns, 
            streak: currentStreak,
            points: (c.points || 0) + earnedPoints
          };
        }
        return c;
      });
      setUserChallenges(updatedUserChallenges);
      
      // Update participants data
      const newParticipants = {...participants};
      const myId = newParticipants[challengeId].users.find(u => u.name === "我").id;
      
      if (!newParticipants[challengeId].checkIns[daysSinceStart]) {
        newParticipants[challengeId].checkIns[daysSinceStart] = [];
      }
      
      if (!newParticipants[challengeId].checkIns[daysSinceStart].includes(myId)) {
        newParticipants[challengeId].checkIns[daysSinceStart].push(myId);
      }
      
      setParticipants(newParticipants);
      
      // Update user stats
      const userChallenge = updatedUserChallenges.find(c => c.id === challengeId);
      const checkInCount = Object.keys(userChallenge?.checkIns || {}).length;
      const currentStreak = userChallenge.streak;
      
      // Earned experience
      const expGained = 20 + (currentStreak * 5);
      const newExp = userStats.exp + expGained;
      let newLevel = userStats.level;
      let nextLevelExp = userStats.nextLevelExp;
      
      // Level up if earned enough exp
      if (newExp >= nextLevelExp) {
        newLevel++;
        nextLevelExp = nextLevelExp * 1.5; // Increase exp required for next level
        
        // Show level up animation
        setRewardEarned({
          type: "level",
          level: newLevel,
          message: `恭喜升级！达到 ${newLevel} 级`
        });
        setShowRewardAnimation(true);
        setTimeout(() => setShowRewardAnimation(false), 4000);
      }
      
      // Check for streak achievements
      if (currentStreak === 3 || currentStreak === 7) {
        setRewardEarned({
          type: "streak",
          days: currentStreak,
          message: `连续打卡 ${currentStreak} 天！`
        });
        setShowRewardAnimation(true);
        setTimeout(() => setShowRewardAnimation(false), 4000);
      }
      
      // Check for challenge completion
      if (checkInCount === challenge.days) {
        const newAchievements = [...userStats.achievements];
        if (!newAchievements.includes(challenge.rewards.completion)) {
          newAchievements.push(challenge.rewards.completion);
          
          // Show achievement animation
          setRewardEarned({
            type: "achievement",
            name: challenge.rewards.completion,
            message: `解锁成就：${challenge.rewards.completion}`
          });
          setShowRewardAnimation(true);
          setTimeout(() => setShowRewardAnimation(false), 4000);
        }
        
        setUserStats({
          ...userStats,
          totalCheckIns: userStats.totalCheckIns + 1,
          longestStreak: Math.max(userStats.longestStreak, currentStreak),
          challengesCompleted: userStats.challengesCompleted + 1,
          level: newLevel,
          exp: newExp,
          nextLevelExp: nextLevelExp,
          achievements: newAchievements
        });
      } else {
        setUserStats({
          ...userStats,
          totalCheckIns: userStats.totalCheckIns + 1,
          longestStreak: Math.max(userStats.longestStreak, currentStreak),
          level: newLevel,
          exp: newExp,
          nextLevelExp: nextLevelExp
        });
      }
      
      // Show motivational message
      const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
      setMotivationMessage(`打卡成功！${randomQuote}`);
      setShowMotivation(true);
      setTimeout(() => setShowMotivation(false), 5000);
    }
    
    // Check for milestones
    checkMilestones();
    
    // Maybe trigger AI coach occasionally
    if (Math.random() < 0.3) { // 30% chance
      const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)];
      setAiCoachMessage(`打卡成功！${randomTip}`);
      setShowAiCoach(true);
      setTimeout(() => setShowAiCoach(false), 8000);
    }
  };

  const getDayStatus = (challenge, day) => {
    const userChallenge = userChallenges.find(c => c.id === challenge.id);
    if (!userChallenge) return 'future';
    
    const today = new Date(2025, 1, 27); // Feb 27, 2025
    const challengeStart = new Date(challenge.startDate);
    const dayDate = new Date(challengeStart);
    dayDate.setDate(challengeStart.getDate() + day);
    
    const daysSinceStart = Math.floor((today - challenge.startDate) / (1000 * 60 * 60 * 24));
    
    if (day < daysSinceStart) {
      return userChallenge.checkIns[day] ? 'completed' : 'missed';
    } else if (day === daysSinceStart) {
      return userChallenge.checkIns[day] ? 'completed' : 'today';
    } else {
      return 'future';
    }
  };

  // AI Coach interaction
  const askAiCoach = async (question) => {
    if (!question.trim()) return;
    
    setIsAiLoading(true);
    const newMessage = {
      role: "user",
      content: question,
    };
    
    const newHistory = [...conversationHistory, newMessage];
    setConversationHistory(newHistory.slice(-10)); // Keep last 10 messages
    
    try {
      const completion = await websim.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "你是一位专业的辟谷养生教练，了解辟谷的原理和注意事项。你的风格积极向上、富有激励性，但也诚实地告知实践中的风险。对于用户的问题，你会提供实用的建议，同时鼓励他们坚持。请用简短、易于理解的语言回复。"
          },
          ...newHistory,
        ],
      });
      
      setAiCoachMessage(completion.content);
      setConversationHistory([...newHistory, completion]);
      setShowAiCoach(true);
      setTimeout(() => setShowAiCoach(false), 10000);
    } catch (error) {
      console.error("AI Coach error:", error);
      setAiCoachMessage("抱歉，我暂时无法回答您的问题。请稍后再试。");
      setShowAiCoach(true);
    } finally {
      setIsAiLoading(false);
      setUserQuestion("");
    }
  };

  // Generate user insights
  const generateInsights = async (challengeId) => {
    const userChallenge = userChallenges.find(c => c.id === challengeId);
    if (!userChallenge) return;
    
    setUserInsights(null); // Clear previous insights
    
    try {
      const checkInData = Object.keys(userChallenge.checkIns).map(day => ({
        day: parseInt(day) + 1,
        date: new Date(userChallenge.startDate.getTime() + (parseInt(day) * 24 * 60 * 60 * 1000))
      }));
      
      const completion = await websim.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `分析用户的挑战打卡数据，生成个性化的洞察和建议。
            挑战：${userChallenge.title}
            总天数：${userChallenge.days}天
            当前连续打卡：${userChallenge.streak}天
            完成率：${Math.round((Object.keys(userChallenge.checkIns).length / userChallenge.days) * 100)}%
            打卡记录：${JSON.stringify(checkInData)}
            请给出3点个性化的建议和1点鼓励。输出应简短、有洞察力且激励性强。`
          },
        ],
      });
      
      setUserInsights({
        text: completion.content,
        generated: new Date()
      });
    } catch (error) {
      console.error("Insights generation error:", error);
    }
  };

  // Check and update milestones
  const checkMilestones = () => {
    const updatedMilestones = [...milestones];
    let milestoneAchieved = false;
    
    // Check first check-in
    if (userStats.totalCheckIns > 0 && !updatedMilestones[0].completed) {
      updatedMilestones[0].completed = true;
      milestoneAchieved = true;
    }
    
    // Check streak milestones
    if (userStats.longestStreak >= 3 && !updatedMilestones[1].completed) {
      updatedMilestones[1].completed = true;
      milestoneAchieved = true;
    }
    
    if (userStats.longestStreak >= 7 && !updatedMilestones[2].completed) {
      updatedMilestones[2].completed = true;
      milestoneAchieved = true;
    }
    
    // Check challenge completion
    if (userStats.challengesCompleted > 0 && !updatedMilestones[3].completed) {
      updatedMilestones[3].completed = true;
      milestoneAchieved = true;
    }
    
    setMilestones(updatedMilestones);
    
    if (milestoneAchieved) {
      setShowMilestones(true);
      setTimeout(() => setShowMilestones(false), 5000);
    }
  };

  // Share challenge progress with AI-generated image
  const shareChallenge = async (challenge) => {
    setShowShareModal(true);
    setShareImageUrl(null);
    
    // Mark sharing milestone as completed
    const updatedMilestones = [...milestones];
    if (!updatedMilestones[4].completed) {
      updatedMilestones[4].completed = true;
      setMilestones(updatedMilestones);
    }
    
    try {
      const userChallenge = userChallenges.find(c => c.id === challenge.id);
      const checkInCount = Object.keys(userChallenge?.checkIns || {}).length;
      const progress = Math.round((checkInCount / challenge.days) * 100);
      
      const result = await websim.imageGen({
        prompt: `一张健康挑战打卡分享图，显示"${challenge.title}"，进度${progress}%，连续打卡${userChallenge?.streak || 0}天，简约扁平化设计，蓝色渐变背景，包含一个打卡标志和火焰图标`,
        aspect_ratio: "1:1",
      });
      
      setShareImageUrl(result.url);
    } catch (error) {
      console.error("Image generation error:", error);
    }
  };

  const createCustomChallenge = () => {
    if (!customGoal.title || customGoal.days < 1) return;
    
    const newId = Math.max(...challenges.map(c => c.id), 0) + 1;
    const today = new Date(2025, 1, 27); // Feb 27, 2025
    
    const newChallenge = {
      id: newId,
      title: customGoal.title,
      days: customGoal.days,
      participants: 1,
      startDate: today,
      active: true,
      description: customGoal.description,
      isCustom: true,
      rewards: {
        completion: "个人目标达成勋章",
        streak: "自律达人徽章",
        social: "目标制定者勋章"
      }
    };
    
    setChallenges([...challenges, newChallenge]);
    
    // Add participants data before joining challenge
    const newParticipants = {...participants};
    newParticipants[newId] = {
      users: [{
        id: 1,
        name: "我",
        avatar: `https://ui-avatars.com/api/?name=我&background=0D8ABC`,
        level: userStats.level,
        streak: userStats.longestStreak
      }],
      checkIns: {}
    };
    setParticipants(newParticipants);
    
    // Now join the challenge after participants data is initialized
    joinChallenge(newChallenge);
    setCustomGoal({ title: "", days: 7, description: "" });
    setActiveView('joined');
    
    // Show motivation message
    setMotivationMessage("太棒了！你创建了个人目标，开始你的健康之旅吧！");
    setShowMotivation(true);
    setTimeout(() => setShowMotivation(false), 5000);
  };

  const renderAvailableChallenges = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">可加入的挑战</h2>
        <button 
          onClick={() => setActiveView('create')}
          className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          创建自定义目标
        </button>
      </div>
      
      {/* Top performers section - new addition */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg">全国榜单前三名</h3>
          <button 
            onClick={() => setShowLeaderboard(true)}
            className="text-orange-700 hover:underline text-sm flex items-center"
          >
            查看完整榜单 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-3 shadow-sm flex items-center">
            <div className="relative mr-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400">
                <img src={leaderboardData.national.streak[0].avatar} alt={leaderboardData.national.streak[0].name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold">1</div>
            </div>
            <div>
              <div className="font-bold">{leaderboardData.national.streak[0].name}</div>
              <div className="text-sm text-orange-600 flex items-center">
                <span className="mr-1">🔥</span> {leaderboardData.national.streak[0].streak}天连续打卡
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm flex items-center">
            <div className="relative mr-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-400">
                <img src={leaderboardData.national.completion[0].avatar} alt={leaderboardData.national.completion[0].name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-xs font-bold">1</div>
            </div>
            <div>
              <div className="font-bold">{leaderboardData.national.completion[0].name}</div>
              <div className="text-sm text-green-600 flex items-center">
                <span className="mr-1">🏆</span> 完成{leaderboardData.national.completion[0].completions}个挑战
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm flex items-center">
            <div className="relative mr-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-400">
                <img src={leaderboardData.national.points[0].avatar} alt={leaderboardData.national.points[0].name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center text-xs font-bold">1</div>
            </div>
            <div>
              <div className="font-bold">{leaderboardData.national.points[0].name}</div>
              <div className="text-sm text-purple-600 flex items-center">
                <span className="mr-1">✨</span> {leaderboardData.national.points[0].points.toLocaleString()}积分
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Regional leaderboard preview - new addition */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg">我的地区榜单 - {userRegion}</h3>
          <button 
            onClick={() => {
              setLeaderboardView('regional');
              setShowLeaderboard(true);
            }}
            className="text-blue-700 hover:underline text-sm flex items-center"
          >
            查看地区榜单 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {leaderboardData.regional[userRegion].streak.slice(0, 1).map((user, index) => (
            <div key={user.id} className="bg-white rounded-lg p-3 shadow-sm flex items-center">
              <div className="relative mr-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-400">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</div>
              </div>
              <div>
                <div className="font-bold">{user.name}</div>
                <div className="text-sm text-orange-600 flex items-center">
                  <span className="mr-1">🔥</span> {user.streak}天连续打卡
                </div>
              </div>
            </div>
          ))}
          {leaderboardData.regional[userRegion].completion.slice(0, 1).map((user, index) => (
            <div key={user.id} className="bg-white rounded-lg p-3 shadow-sm flex items-center">
              <div className="relative mr-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-400">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</div>
              </div>
              <div>
                <div className="font-bold">{user.name}</div>
                <div className="text-sm text-green-600 flex items-center">
                  <span className="mr-1">🏆</span> 完成{user.completions}个挑战
                </div>
              </div>
            </div>
          ))}
          {leaderboardData.regional[userRegion].points.slice(0, 1).map((user, index) => (
            <div key={user.id} className="bg-white rounded-lg p-3 shadow-sm flex items-center">
              <div className="relative mr-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-400">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</div>
              </div>
              <div>
                <div className="font-bold">{user.name}</div>
                <div className="text-sm text-purple-600 flex items-center">
                  <span className="mr-1">✨</span> {user.points.toLocaleString()}积分
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {userStats.level > 1 && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-center">
          <div className="mr-4">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
              Lv.{userStats.level}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg">我的健康等级: {userStats.level}</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{width: `${(userStats.exp/userStats.nextLevelExp) * 100}%`}}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">经验值: {userStats.exp}/{Math.round(userStats.nextLevelExp)}</p>
          </div>
        </div>
      )}
      
      {/* Milestone Progress */}
      <div className="bg-amber-50 p-4 rounded-lg mb-6">
        <h3 className="font-bold text-lg mb-2">我的成就进度</h3>
        <div className="grid grid-cols-5 gap-2">
          {milestones.map((milestone) => (
            <div 
              key={milestone.id}
              className={`text-center p-2 rounded-lg border ${
                milestone.completed 
                  ? 'bg-amber-100 border-amber-400 text-amber-800' 
                  : 'bg-gray-100 border-gray-300 text-gray-500'
              }`}
              title={milestone.description}
            >
              <div className="text-2xl mb-1">
                {milestone.completed ? '🏆' : '🔒'}
              </div>
              <div className="text-xs font-medium line-clamp-1">{milestone.title}</div>
            </div>
          ))}
        </div>
        <button 
          onClick={() => setShowMilestones(true)}
          className="w-full mt-2 text-center text-amber-700 text-sm hover:underline"
        >
          查看全部成就
        </button>
      </div>
      
      {/* Daily Tip */}
      <div className="bg-green-50 p-4 rounded-lg mb-6 flex items-center">
        <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-xl mr-4">
          💡
        </div>
        <div>
          <h3 className="font-bold text-lg">今日养生小贴士</h3>
          <p className="text-gray-700">{dailyTips[Math.floor(Math.random() * dailyTips.length)]}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.filter(c => c.active && !c.isCustom).map(challenge => (
          <div key={challenge.id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-primary">{challenge.title}</h3>
              <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg">
                热门挑战
              </div>
            </div>
            <p className="text-gray-600 my-2">持续时间: {challenge.days} 天</p>
            <p className="text-gray-600">参与人数: {challenge.participants} 人</p>
            <p className="text-gray-600 mb-2">开始日期: {challenge.startDate.toLocaleDateString()}</p>
            
            <div className="mt-3 mb-4">
              <h4 className="text-sm font-bold mb-1 text-gray-700">可获得奖励:</h4>
              <div className="flex flex-wrap gap-1">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                  {challenge.rewards.completion}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  {challenge.rewards.streak}
                </span>
              </div>
            </div>
            
            {userChallenges.find(c => c.id === challenge.id) ? (
              <button 
                onClick={() => {
                  setSelectedChallenge(challenge);
                  setActiveView('challenge');
                }}
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                已加入 - 查看详情
              </button>
            ) : (
              <button 
                onClick={() => joinChallenge(challenge)}
                className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                加入挑战
              </button>
            )}
          </div>
        ))}
      </div>
      
      {/* Custom Challenges Section */}
      {challenges.filter(c => c.active && c.isCustom).length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-8">我的自定义目标</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.filter(c => c.active && c.isCustom).map(challenge => (
              <div key={challenge.id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-green-50">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-green-700">{challenge.title}</h3>
                  <div className="bg-green-200 text-green-800 px-2 py-1 rounded text-sm font-bold">
                    个人目标
                  </div>
                </div>
                <p className="text-gray-600 my-2">持续时间: {challenge.days} 天</p>
                {challenge.description && (
                  <p className="text-gray-700 my-2 italic">"{challenge.description}"</p>
                )}
                
                <button 
                  onClick={() => {
                    setSelectedChallenge(challenge);
                    setActiveView('challenge');
                  }}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  查看详情
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      
      {challenges.filter(c => !c.active).length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mt-8">即将开始的挑战</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.filter(c => !c.active).map(challenge => (
              <div key={challenge.id} className="border rounded-lg p-6 shadow-sm bg-gray-50">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-500">{challenge.title}</h3>
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    即将开始
                  </div>
                </div>
                <p className="text-gray-600 my-2">持续时间: {challenge.days} 天</p>
                <p className="text-gray-600">参与人数: {challenge.participants} 人</p>
                <p className="text-gray-600 mb-2">开始日期: {challenge.startDate.toLocaleDateString()}</p>
                
                <div className="mt-3 mb-4">
                  <h4 className="text-sm font-bold mb-1 text-gray-700">可获得奖励:</h4>
                  <div className="flex flex-wrap gap-1">
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {challenge.rewards.completion}
                    </span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {challenge.rewards.streak}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setMotivationMessage(`提醒已设置！挑战开始时我们会通知你。`);
                    setShowMotivation(true);
                    setTimeout(() => setShowMotivation(false), 3000);
                  }}
                  className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  开始前提醒我
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderJoinedChallenges = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">我参与的挑战</h2>
        
        {userStats.challengesCompleted > 0 && (
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-lg">
            已完成挑战: {userStats.challengesCompleted}
          </div>
        )}
      </div>
      
      {userStats.achievements.length > 0 && (
        <div className="bg-purple-50 rounded-lg p-4 mb-4">
          <h3 className="font-bold text-lg mb-2">我的成就</h3>
          <div className="flex flex-wrap gap-2">
            {userStats.achievements.map((achievement, index) => (
              <div key={index} className="bg-white border border-purple-200 rounded-lg px-3 py-2 flex items-center">
                <span className="text-purple-600 mr-2">🏆</span>
                <span>{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {userChallenges.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-gray-50">
          <p className="text-gray-600">您还没有参加任何挑战</p>
          <p className="text-gray-600 text-sm mt-2 mb-4">加入挑战，获得健康生活新体验！</p>
          <button 
            onClick={() => setActiveView('available')}
            className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            浏览挑战
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userChallenges.map(challenge => {
            const today = new Date(2025, 1, 27); // Feb 27, 2025
            const daysSinceStart = Math.floor((today - challenge.startDate) / (1000 * 60 * 60 * 24));
            const progress = Math.min(Math.max(0, daysSinceStart + 1), challenge.days);
            const progressPercent = (progress / challenge.days) * 100;
            
            // Count check-ins
            const checkInCount = Object.keys(challenge.checkIns).length;
            const completion = Math.round((checkInCount / progress) * 100);
            
            return (
              <div key={challenge.id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between">
                  <h3 className="text-xl font-bold text-primary">{challenge.title}</h3>
                  {challenge.streak >= 3 && (
                    <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded flex items-center text-sm">
                      <span className="mr-1">🔥</span> {challenge.streak}天连续
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center my-2">
                  <p className="text-gray-600">进度: {progress}/{challenge.days} 天</p>
                  {challenge.points > 0 && (
                    <p className="text-indigo-600 font-bold">积分: {challenge.points}</p>
                  )}
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div className="bg-primary h-2.5 rounded-full" style={{width: `${progressPercent}%`}}></div>
                </div>
                
                <div className="flex justify-between text-sm mb-4">
                  <p className="text-gray-600">已签到: {checkInCount} 天</p>
                  <p className={`${completion >= 80 ? 'text-green-600' : completion >= 50 ? 'text-yellow-600' : 'text-red-600'} font-medium`}>
                    完成率: {completion}%
                  </p>
                </div>
                
                <button 
                  onClick={() => {
                    setSelectedChallenge(challenge);
                    setActiveView('challenge');
                  }}
                  className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-lg font-bold"
                >
                  {daysSinceStart >= 0 && daysSinceStart < challenge.days && !challenge.checkIns[daysSinceStart] ? 
                    "去签到" : "查看详情"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderCreateCustomChallenge = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-8">
        <button 
          onClick={() => setActiveView('available')}
          className="text-primary hover:underline"
        >
          &larr; 返回
        </button>
        <h2 className="text-2xl font-bold">创建自定义目标</h2>
      </div>
      
      <div className="bg-white rounded-lg p-8 shadow-md">
        <div className="mb-6">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">目标名称</label>
          <input 
            type="text" 
            id="title"
            value={customGoal.title}
            onChange={(e) => setCustomGoal({...customGoal, title: e.target.value})}
            placeholder="例：每日冥想养生" 
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="days" className="block text-gray-700 font-bold mb-2">持续天数</label>
          <input 
            type="number" 
            id="days"
            min="1"
            max="30"
            value={customGoal.days}
            onChange={(e) => setCustomGoal({...customGoal, days: parseInt(e.target.value) || 7})}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-sm text-gray-500 mt-1">建议选择7-21天，太短难以形成习惯，太长可能难以坚持</p>
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">目标描述（可选）</label>
          <textarea 
            id="description"
            value={customGoal.description}
            onChange={(e) => setCustomGoal({...customGoal, description: e.target.value})}
            placeholder="描述一下你的目标和期望..." 
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            rows="3"
          ></textarea>
        </div>
        
        <button 
          onClick={createCustomChallenge}
          disabled={!customGoal.title || customGoal.days < 1}
          className={`w-full py-3 rounded-lg text-white font-bold text-lg ${
            !customGoal.title || customGoal.days < 1 ? 'bg-gray-400' : 'bg-primary hover:bg-blue-600'
          } transition-colors`}
        >
          创建我的目标
        </button>
      </div>
      
      <div className="bg-yellow-50 rounded-lg p-6 mt-6">
        <h3 className="font-bold text-lg mb-2">为什么要设定自定义目标？</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>具体目标能提高60%的完成率</li>
          <li>个人制定的目标更有成就感</li>
          <li>适合自己节奏的目标更容易坚持</li>
          <li>根据自身情况调整挑战难度</li>
        </ul>
      </div>
    </div>
  );

  const renderChallengeDetail = () => {
    if (!selectedChallenge) return null;
    
    const challenge = challenges.find(c => c.id === selectedChallenge.id);
    const userChallenge = userChallenges.find(c => c.id === selectedChallenge.id);
    const isJoined = !!userChallenge;
    
    const today = new Date(2025, 1, 27); // Feb 27, 2025
    const daysSinceStart = Math.floor((today - challenge.startDate) / (1000 * 60 * 60 * 24));
    const isActive = daysSinceStart >= 0 && daysSinceStart < challenge.days;
    const canCheckIn = isActive && isJoined && !userChallenge?.checkIns[daysSinceStart];
    
    // Calculate days array to display
    const days = [];
    for (let i = 0; i < challenge.days; i++) {
      const dayDate = new Date(challenge.startDate);
      dayDate.setDate(challenge.startDate.getDate() + i);
      days.push({
        day: i + 1,
        date: dayDate,
        status: isJoined ? getDayStatus(challenge, i) : 'future'
      });
    }
    
    // Get today's check-ins
    const todayCheckIns = participants[challenge.id]?.checkIns[daysSinceStart] || [];
    const totalParticipants = participants[challenge.id]?.users.length || 0;
    
    // Calculate users with highest streaks
    const topUsers = [...(participants[challenge.id]?.users || [])]
      .sort((a, b) => (b.streak || 0) - (a.streak || 0))
      .slice(0, 5);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setActiveView(userChallenges.find(c => c.id === challenge.id) ? 'joined' : 'available')}
            className="text-primary hover:underline"
          >
            &larr; 返回
          </button>
          <h2 className="text-2xl font-bold">{challenge.title}</h2>
          
          {/* Add share button */}
          {isJoined && (
            <button 
              onClick={() => shareChallenge(challenge)}
              className="ml-auto bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-200 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              分享我的进度
            </button>
          )}
        </div>
        
        {/* Challenge description if exists */}
        {challenge.description && (
          <div className="italic text-gray-600 bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
            "{challenge.description}"
          </div>
        )}
        
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-600">开始日期: {challenge.startDate.toLocaleDateString()}</p>
              <p className="text-gray-600">持续时间: {challenge.days} 天</p>
              <p className="text-gray-600">参与人数: {challenge.participants} 人</p>
              
              {isJoined && userChallenge.streak > 0 && (
                <div className="flex items-center mt-2 text-orange-600 font-bold">
                  <span className="mr-2">🔥</span> 
                  连续打卡: {userChallenge.streak} 天
                </div>
              )}
            </div>
            
            {!isJoined && (
              <button 
                onClick={() => joinChallenge(challenge)}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                加入挑战
              </button>
            )}
            
            {isJoined && canCheckIn && (
              <button 
                onClick={() => checkIn(challenge.id)}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors text-lg font-bold animate-pulse"
              >
                今日签到 +{10 * Math.min(userChallenge.streak + 1, 7)}分
              </button>
            )}
            
            {isJoined && !canCheckIn && daysSinceStart < 0 && (
              <div className="text-orange-500 font-bold">
                挑战尚未开始
              </div>
            )}
            
            {isJoined && !canCheckIn && daysSinceStart >= 0 && daysSinceStart < challenge.days && (
              <div className="text-green-500 font-bold flex items-center">
                <span className="mr-2">✓</span> 今日已签到
              </div>
            )}
            
            {isJoined && daysSinceStart >= challenge.days && (
              <div className="text-blue-500 font-bold">
                挑战已结束
              </div>
            )}
          </div>
          
          {isJoined && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">签到进度</h3>
                {userChallenge.points > 0 && (
                  <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg">
                    积分: {userChallenge.points}
                  </div>
                )}
              </div>
              
              {/* Visual progress bar */}
              <div className="bg-white p-4 rounded-lg mb-4 border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-blue-800">总进度</span>
                  <span className="font-bold text-blue-800">
                    {Object.keys(userChallenge?.checkIns || {}).length}/{challenge.days} 天
                    ({Math.round((Object.keys(userChallenge?.checkIns || {}).length / challenge.days) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-1000 ease-out"
                    style={{width: `${(Object.keys(userChallenge?.checkIns || {}).length / challenge.days) * 100}%`}}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {days.map((day) => (
                  <div 
                    key={day.day} 
                    className={`text-center p-2 rounded-lg border ${
                      day.status === 'completed' ? 'bg-green-100 border-green-500 text-green-700' :
                      day.status === 'missed' ? 'bg-red-100 border-red-500 text-red-700' :
                      day.status === 'today' ? 'bg-blue-100 border-blue-500 text-blue-700 font-bold animate-pulse' :
                      'bg-gray-50 border-gray-200 text-gray-500'
                    }`}
                  >
                    <div className="text-sm">第{day.day}天</div>
                    <div className="text-xs">{day.date.toLocaleDateString().slice(5)}</div>
                    {day.status === 'completed' && <div className="text-xs mt-1">✓</div>}
                    {day.status === 'missed' && <div className="text-xs mt-1">✗</div>}
                    {day.status === 'today' && <div className="text-xs mt-1 font-bold">今天</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Challenge insights and analytics */}
        {isJoined && Object.keys(userChallenge?.checkIns || {}).length > 0 && (
          <div className="bg-indigo-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">你的挑战数据</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500 mb-1">完成率</div>
                <div className="text-2xl font-bold text-indigo-600">
                  {Math.round((Object.keys(userChallenge?.checkIns || {}).length / Math.min(daysSinceStart + 1, challenge.days)) * 100)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {Object.keys(userChallenge?.checkIns || {}).length}/{Math.min(daysSinceStart + 1, challenge.days)} 天已打卡
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500 mb-1">当前连续打卡</div>
                <div className="text-2xl font-bold text-orange-600 flex items-center">
                  <span className="mr-1">🔥</span> {userChallenge?.streak || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {userChallenge?.streak >= 3 ? "太棒了！继续保持！" : "再接再厉！"}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500 mb-1">挑战积分</div>
                <div className="text-2xl font-bold text-purple-600">
                  {userChallenge?.points || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  每日打卡 +{10 * Math.min(userChallenge?.streak + 1 || 1, 7)}分
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* AI-Generated Insights */}
        {isJoined && Object.keys(userChallenge?.checkIns || {}).length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">个性化分析</h3>
              <button 
                onClick={() => generateInsights(challenge.id)}
                className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-200 transition-colors text-sm"
              >
                {userInsights ? "刷新分析" : "生成分析"}
              </button>
            </div>
            
            {userInsights ? (
              <div className="bg-white rounded-lg p-4 border border-indigo-100">
                <div className="whitespace-pre-line">{userInsights.text}</div>
                <div className="text-xs text-gray-500 mt-2">
                  分析生成于: {userInsights.generated.toLocaleTimeString()}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4 border border-indigo-100 text-center text-gray-500">
                点击"生成分析"获取个性化洞察
              </div>
            )}
          </div>
        )}
        
        {/* Community Support */}
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-4">社区鼓励</h3>
          <div className="flex space-x-2 mb-4">
            <button 
              className="flex-1 bg-pink-50 border border-pink-200 rounded-lg p-3 text-center hover:bg-pink-100 transition-colors"
              onClick={() => {
                setMotivationMessage("收到了来自社区的鼓励：加油，你做得很棒！");
                setShowMotivation(true);
                setTimeout(() => setShowMotivation(false), 3000);
              }}
            >
              <div className="text-2xl mb-1">👍</div>
              <div className="text-sm">点赞鼓励</div>
            </button>
            <button 
              className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-3 text-center hover:bg-blue-100 transition-colors"
              onClick={() => {
                setMotivationMessage("收到了来自社区的鼓励：继续保持，不要放弃！");
                setShowMotivation(true);
                setTimeout(() => setShowMotivation(false), 3000);
              }}
            >
              <div className="text-2xl mb-1">🔥</div>
              <div className="text-sm">加油助威</div>
            </button>
            <button 
              className="flex-1 bg-purple-50 border border-purple-200 rounded-lg p-3 text-center hover:bg-purple-100 transition-colors"
              onClick={() => {
                setMotivationMessage("收到了来自社区的鼓励：你的坚持激励了我们所有人！");
                setShowMotivation(true);
                setTimeout(() => setShowMotivation(false), 3000);
              }}
            >
              <div className="text-2xl mb-1">🌟</div>
              <div className="text-sm">星星鼓励</div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add leaderboard data and states
  const [leaderboardView, setLeaderboardView] = useState('national'); // 'national' or 'regional'
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState({
    national: {
      streak: [
        { id: 101, name: "王健康", avatar: "https://ui-avatars.com/api/?name=王健康&background=random", region: "北京", streak: 120, level: 25 },
        { id: 102, name: "李养生", avatar: "https://ui-avatars.com/api/?name=李养生&background=random", region: "上海", streak: 115, level: 22 },
        { id: 103, name: "张三丰", avatar: "https://ui-avatars.com/api/?name=张三丰&background=random", region: "武汉", streak: 101, level: 20 },
        { id: 104, name: "刘达人", avatar: "https://ui-avatars.com/api/?name=刘达人&background=random", region: "广州", streak: 98, level: 19 },
        { id: 105, name: "陈辟谷", avatar: "https://ui-avatars.com/api/?name=陈辟谷&background=random", region: "深圳", streak: 91, level: 18 }
      ],
      completion: [
        { id: 201, name: "黄健身", avatar: "https://ui-avatars.com/api/?name=黄健身&background=random", region: "杭州", completions: 32, level: 28 },
        { id: 202, name: "吴修行", avatar: "https://ui-avatars.com/api/?name=吴修行&background=random", region: "成都", completions: 30, level: 26 },
        { id: 203, name: "赵养颜", avatar: "https://ui-avatars.com/api/?name=赵养颜&background=random", region: "重庆", completions: 28, level: 25 },
        { id: 204, name: "孙大师", avatar: "https://ui-avatars.com/api/?name=孙大师&background=random", region: "南京", completions: 25, level: 23 },
        { id: 205, name: "钱天师", avatar: "https://ui-avatars.com/api/?name=钱天师&background=random", region: "西安", completions: 24, level: 21 }
      ],
      points: [
        { id: 301, name: "周冠军", avatar: "https://ui-avatars.com/api/?name=周冠军&background=random", region: "天津", points: 15820, level: 30 },
        { id: 302, name: "吴亚军", avatar: "https://ui-avatars.com/api/?name=吴亚军&background=random", region: "苏州", points: 14750, level: 28 },
        { id: 303, name: "郑季军", avatar: "https://ui-avatars.com/api/?name=郑季军&background=random", region: "厦门", points: 13900, level: 26 },
        { id: 304, name: "王四名", avatar: "https://ui-avatars.com/api/?name=王四名&background=random", region: "青岛", points: 12800, level: 25 },
        { id: 305, name: "李五名", avatar: "https://ui-avatars.com/api/?name=李五名&background=random", region: "大连", points: 11750, level: 23 }
      ]
    },
    regional: {
      '北京': {
        streak: [
          { id: 401, name: "王北京", avatar: "https://ui-avatars.com/api/?name=王北京&background=random", streak: 85, level: 17 },
          { id: 402, name: "李京城", avatar: "https://ui-avatars.com/api/?name=李京城&background=random", streak: 78, level: 16 },
          { id: 403, name: "张燕郊", avatar: "https://ui-avatars.com/api/?name=张燕郊&background=random", streak: 72, level: 15 }
        ],
        completion: [
          { id: 501, name: "刘长城", avatar: "https://ui-avatars.com/api/?name=刘长城&background=random", completions: 20, level: 18 },
          { id: 502, name: "陈后海", avatar: "https://ui-avatars.com/api/?name=陈后海&background=random", completions: 18, level: 17 },
          { id: 503, name: "黄颐和", avatar: "https://ui-avatars.com/api/?name=黄颐和&background=random", completions: 15, level: 16 }
        ],
        points: [
          { id: 601, name: "赵天安", avatar: "https://ui-avatars.com/api/?name=赵天安&background=random", points: 10200, level: 20 },
          { id: 602, name: "钱国贸", avatar: "https://ui-avatars.com/api/?name=钱国贸&background=random", points: 9800, level: 19 },
          { id: 603, name: "孙望京", avatar: "https://ui-avatars.com/api/?name=孙望京&background=random", points: 9500, level: 18 }
        ]
      },
      '上海': {
        streak: [
          { id: 701, name: "周魔都", avatar: "https://ui-avatars.com/api/?name=周魔都&background=random", streak: 88, level: 18 },
          { id: 702, name: "吴浦东", avatar: "https://ui-avatars.com/api/?name=吴浦东&background=random", streak: 82, level: 17 },
          { id: 703, name: "郑外滩", avatar: "https://ui-avatars.com/api/?name=郑外滩&background=random", streak: 75, level: 16 }
        ],
        completion: [
          { id: 801, name: "冯陆家", avatar: "https://ui-avatars.com/api/?name=冯陆家&background=random", completions: 22, level: 19 },
          { id: 802, name: "陈静安", avatar: "https://ui-avatars.com/api/?name=陈静安&background=random", completions: 19, level: 18 },
          { id: 803, name: "褚徐汇", avatar: "https://ui-avatars.com/api/?name=褚徐汇&background=random", completions: 17, level: 17 }
        ],
        points: [
          { id: 901, name: "魏世纪", avatar: "https://ui-avatars.com/api/?name=魏世纪&background=random", points: 10500, level: 21 },
          { id: 902, name: "蒋环球", avatar: "https://ui-avatars.com/api/?name=蒋环球&background=random", points: 10100, level: 20 },
          { id: 903, name: "沈南京", avatar: "https://ui-avatars.com/api/?name=沈南京&background=random", points: 9700, level: 19 }
        ]
      },
      '广州': {
        streak: [
          { id: 1001, name: "韩羊城", avatar: "https://ui-avatars.com/api/?name=韩羊城&background=random", streak: 80, level: 17 },
          { id: 1002, name: "杨越秀", avatar: "https://ui-avatars.com/api/?name=杨越秀&background=random", streak: 76, level: 16 },
          { id: 1003, name: "朱天河", avatar: "https://ui-avatars.com/api/?name=朱天河&background=random", streak: 70, level: 15 }
        ],
        completion: [
          { id: 1101, name: "秦白云", avatar: "https://ui-avatars.com/api/?name=秦白云&background=random", completions: 19, level: 18 },
          { id: 1102, name: "尤海珠", avatar: "https://ui-avatars.com/api/?name=尤海珠&background=random", completions: 17, level: 17 },
          { id: 1103, name: "许荔湾", avatar: "https://ui-avatars.com/api/?name=许荔湾&background=random", completions: 15, level: 16 }
        ],
        points: [
          { id: 1201, name: "何番禺", avatar: "https://ui-avatars.com/api/?name=何番禺&background=random", points: 9800, level: 19 },
          { id: 1202, name: "吕黄埔", avatar: "https://ui-avatars.com/api/?name=吕黄埔&background=random", points: 9400, level: 18 },
          { id: 1203, name: "施花都", avatar: "https://ui-avatars.com/api/?name=施花都&background=random", points: 9100, level: 17 }
        ]
      }
    }
  });
  
  const [userRegion, setUserRegion] = useState('北京'); // Default user region

  const renderLeaderboard = () => {
    const regions = Object.keys(leaderboardData.regional);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-8">
          <button 
            onClick={() => setShowLeaderboard(false)}
            className="text-primary hover:underline"
          >
            &larr; 返回
          </button>
          <h2 className="text-2xl font-bold">健康排行榜</h2>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button 
              onClick={() => setLeaderboardView('national')}
              className={`px-4 py-2 ${leaderboardView === 'national' ? 'border-b-2 border-primary text-primary font-bold' : 'text-gray-600'}`}
            >
              全国排行
            </button>
            <button 
              onClick={() => setLeaderboardView('regional')}
              className={`px-4 py-2 ${leaderboardView === 'regional' ? 'border-b-2 border-primary text-primary font-bold' : 'text-gray-600'} relative`}
            >
              地区排行
            </button>
          </div>
          
          {leaderboardView === 'regional' && (
            <select 
              value={userRegion}
              onChange={(e) => setUserRegion(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Streak Leaderboard */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-orange-100 p-4">
              <h3 className="font-bold text-lg text-orange-800 flex items-center">
                <span className="mr-2">🔥</span> 连续打卡榜
              </h3>
            </div>
            <div className="divide-y">
              {(leaderboardView === 'national' 
                ? leaderboardData.national.streak 
                : leaderboardData.regional[userRegion].streak
              ).map((user, index) => (
                <div key={user.id} className="p-4 flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-500 mr-3">
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <div className="font-bold">{user.name}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      {leaderboardView === 'national' && (
                        <span className="mr-2">{user.region}</span>
                      )}
                      <span className="bg-purple-100 text-purple-800 rounded-full px-2 py-0.5 text-xs">
                        Lv.{user.level}
                      </span>
                    </div>
                  </div>
                  <div className="font-bold text-orange-600 flex items-center">
                    <span className="mr-1">🔥</span>{user.streak}天
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Completion Leaderboard */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-green-100 p-4">
              <h3 className="font-bold text-lg text-green-800 flex items-center">
                <span className="mr-2">🏆</span> 挑战完成榜
              </h3>
            </div>
            <div className="divide-y">
              {(leaderboardView === 'national' 
                ? leaderboardData.national.completion 
                : leaderboardData.regional[userRegion].completion
              ).map((user, index) => (
                <div key={user.id} className="p-4 flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-500 mr-3">
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <div className="font-bold">{user.name}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      {leaderboardView === 'national' && (
                        <span className="mr-2">{user.region}</span>
                      )}
                      <span className="bg-purple-100 text-purple-800 rounded-full px-2 py-0.5 text-xs">
                        Lv.{user.level}
                      </span>
                    </div>
                  </div>
                  <div className="font-bold text-green-600 flex items-center">
                    {user.completions}次完成
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Points Leaderboard */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-purple-100 p-4">
              <h3 className="font-bold text-lg text-purple-800 flex items-center">
                <span className="mr-2">✨</span> 积分排行榜
              </h3>
            </div>
            <div className="divide-y">
              {(leaderboardView === 'national' 
                ? leaderboardData.national.points 
                : leaderboardData.regional[userRegion].points
              ).map((user, index) => (
                <div key={user.id} className="p-4 flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-500 mr-3">
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <div className="font-bold">{user.name}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      {leaderboardView === 'national' && (
                        <span className="mr-2">{user.region}</span>
                      )}
                      <span className="bg-purple-100 text-purple-800 rounded-full px-2 py-0.5 text-xs">
                        Lv.{user.level}
                      </span>
                    </div>
                  </div>
                  <div className="font-bold text-purple-600 flex items-center">
                    {user.points.toLocaleString()}分
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-6 rounded-lg mt-8">
          <h3 className="font-bold text-lg mb-2">如何提升排名？</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>坚持每日打卡，提高连续打卡天数</li>
            <li>完成更多挑战，提升完成次数</li>
            <li>每日打卡获取积分，连续打卡倍数提升</li>
            <li>在社区分享你的健康进度，获得额外积分</li>
            <li>创建并完成个人挑战，获得成就积分</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderAiCoachView = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-8">
        <button 
          onClick={() => setActiveView('available')}
          className="text-primary hover:underline"
        >
          &larr; 返回
        </button>
        <h2 className="text-2xl font-bold">AI养生教练</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">营养咨询</h3>
          <p className="text-gray-700 mb-3">了解辟谷期间的营养摄入和饮食调整</p>
          <button 
            onClick={() => {
              setUserQuestion("辟谷期间应该如何补充营养？");
              askAiCoach("辟谷期间应该如何补充营养？");
            }}
            className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
          >
            咨询营养问题
          </button>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">身体调理</h3>
          <p className="text-gray-700 mb-3">辟谷期间身体反应和调理方法指导</p>
          <button 
            onClick={() => {
              setUserQuestion("辟谷期间出现头晕乏力怎么办？");
              askAiCoach("辟谷期间出现头晕乏力怎么办？");
            }}
            className="w-full bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
          >
            咨询身体问题
          </button>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">心理辅导</h3>
          <p className="text-gray-700 mb-3">坚持辟谷过程中的心理调适和压力管理</p>
          <button 
            onClick={() => {
              setUserQuestion("如何克服辟谷期间的饥饿感和心理压力？");
              askAiCoach("如何克服辟谷期间的饥饿感和心理压力？");
            }}
            className="w-full bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700"
          >
            咨询心理问题
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-indigo-600 p-4 text-white">
          <h3 className="font-bold text-xl flex items-center">
            <span className="mr-2">🤖</span> 与AI养生教练对话
          </h3>
          <p className="text-indigo-100 mt-1">
            有任何辟谷、养生相关的问题？随时向我提问!
          </p>
        </div>
        
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-4 min-h-[300px] max-h-[400px] overflow-y-auto">
            {conversationHistory.length > 0 ? (
              <div className="space-y-4">
                {conversationHistory.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-lg px-4 py-3 max-w-md ${
                      msg.role === 'user' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-indigo-50 text-gray-800'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                向AI养生教练提问，获取专业建议
              </div>
            )}
          </div>
          
          <div className="flex">
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="输入您的问题..."
              className="flex-grow px-4 py-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyPress={(e) => e.key === 'Enter' && askAiCoach(userQuestion)}
            />
            <button
              onClick={() => askAiCoach(userQuestion)}
              disabled={!userQuestion.trim() || isAiLoading}
              className={`bg-indigo-600 text-white px-6 py-3 rounded-r-lg ${
                !userQuestion.trim() || isAiLoading
                  ? 'opacity-50'
                  : 'hover:bg-indigo-700'
              } transition-colors`}
            >
              {isAiLoading ? (
                <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "发送"}
            </button>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-bold mb-2 text-gray-700">推荐问题:</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                "辟谷期间饿了怎么办？", 
                "如何安全开始辟谷？", 
                "辟谷有什么好处？", 
                "辟谷后如何恢复饮食？",
                "辟谷期间可以运动吗？",
                "辟谷和断食有什么区别？",
                "什么体质不适合辟谷？",
                "如何知道辟谷效果好不好?"
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setUserQuestion(q);
                    askAiCoach(q);
                  }}
                  className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-50 p-6 rounded-lg mt-6">
        <h3 className="font-bold text-lg mb-2">辟谷小贴士</h3>
        <div className="space-y-3">
          {dailyTips.map((tip, index) => (
            <div key={index} className="flex items-start">
              <div className="text-yellow-600 mr-2">💡</div>
              <p className="text-gray-700">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {isAdmin ? (
        <window.AdminPanel 
          challenges={challenges}
          setChallenges={setChallenges}
          participants={participants}
          setParticipants={setParticipants}
          userChallenges={userChallenges}
          setUserChallenges={setUserChallenges}
          onReturn={() => setIsAdmin(false)}
        />
      ) : (
        <>
          <header className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-4 text-primary">挑战打卡</h1>
                <p className="text-lg text-gray-600">加入挑战，每日打卡，一起变得更好</p>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => {
                    setShowLeaderboard(false);
                    setActiveView('aicoach');
                  }}
                  className="bg-indigo-100 text-indigo-800 px-3 py-2 rounded-lg hover:bg-indigo-200 transition-colors flex items-center"
                  title="AI养生教练"
                >
                  <span className="mr-1">🤖</span>
                  AI养生教练
                </button>
                <button 
                  onClick={() => setShowLeaderboard(true)}
                  className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg hover:bg-yellow-200 transition-colors flex items-center"
                  title="排行榜"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                  排行榜
                </button>
                <button
                  onClick={() => setIsAdmin(true)}
                  className="text-gray-500 hover:text-gray-700"
                  title="管理后台"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          <div className="mb-8 border-b pb-4">
            {!showLeaderboard && activeView !== 'aicoach' && (
              <div className="flex space-x-4">
                <button 
                  onClick={() => setActiveView('available')}
                  className={`px-4 py-2 ${activeView === 'available' ? 'border-b-2 border-primary text-primary font-bold' : 'text-gray-600'}`}
                >
                  挑战列表
                </button>
                <button 
                  onClick={() => setActiveView('joined')}
                  className={`px-4 py-2 ${activeView === 'joined' ? 'border-b-2 border-primary text-primary font-bold' : 'text-gray-600'} relative`}
                >
                  我的挑战
                  {userChallenges.some(c => {
                    const daysSinceStart = Math.floor((new Date(2025, 1, 27) - c.startDate) / (1000 * 60 * 60 * 24));
                    return daysSinceStart >= 0 && daysSinceStart < c.days && !c.checkIns[daysSinceStart];
                  }) && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      !
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          <main>
            {showLeaderboard ? (
              renderLeaderboard()
            ) : (
              <>
                {activeView === 'available' && renderAvailableChallenges()}
                {activeView === 'joined' && renderJoinedChallenges()}
                {activeView === 'challenge' && renderChallengeDetail()}
                {activeView === 'create' && renderCreateCustomChallenge()}
                {activeView === 'aicoach' && renderAiCoachView()}
              </>
            )}
          </main>
          
          {/* Motivational message toast */}
          {showMotivation && (
            <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg max-w-md animate-fade-in-up">
              {motivationMessage}
            </div>
          )}
          
          {/* AI Coach message */}
          {showAiCoach && (
            <div className="fixed bottom-6 left-6 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg max-w-md animate-fade-in-up">
              <div className="flex">
                <div className="mr-3 text-2xl">🤖</div>
                <div>
                  <div className="font-bold mb-1">养生教练提示</div>
                  <div>{aiCoachMessage}</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Share Modal */}
          {showShareModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md text-center animate-bounce-in">
                <h3 className="text-2xl font-bold mb-4">分享我的健康挑战</h3>
                
                {shareImageUrl ? (
                  <img src={shareImageUrl} alt="挑战分享" className="w-full h-auto rounded-lg mb-4" />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-gray-500">生成中...</span>
                  </div>
                )}
                
                <div className="flex space-x-4 mt-4">
                  <button 
                    onClick={() => setShowShareModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    关闭
                  </button>
                  <button 
                    onClick={() => {
                      // Simulate share
                      setShowShareModal(false);
                      setMotivationMessage("分享成功！感谢你传播健康生活方式！");
                      setShowMotivation(true);
                      setTimeout(() => setShowMotivation(false), 3000);
                    }}
                    className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    分享到朋友圈
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Reward animation overlay */}
          {showRewardAnimation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md text-center animate-bounce-in">
                {rewardEarned.type === "level" && (
                  <>
                    <div className="text-4xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold mb-2">恭喜升级!</h3>
                    <p className="text-lg mb-4">你已达到 Lv.{rewardEarned.level}</p>
                    <div className="w-24 h-24 rounded-full bg-primary text-white mx-auto flex items-center justify-center text-3xl font-bold mb-4">
                      {rewardEarned.level}
                    </div>
                    <p>继续坚持，解锁更多成就！</p>
                  </>
                )}
                
                {rewardEarned.type === "streak" && (
                  <>
                    <div className="text-4xl mb-4">🔥</div>
                    <h3 className="text-2xl font-bold mb-2">连续打卡 {rewardEarned.days} 天!</h3>
                    <p className="text-lg mb-4">太棒了，你的毅力令人钦佩！</p>
                    <div className="text-6xl mb-4">🔥 {rewardEarned.days} 🔥</div>
                    <p>现在你的打卡奖励是 {Math.min(rewardEarned.days, 7)}倍!</p>
                  </>
                )}
                
                {rewardEarned.type === "achievement" && (
                  <>
                    <div className="text-4xl mb-4">🏆</div>
                    <h3 className="text-2xl font-bold mb-2">获得成就!</h3>
                    <p className="text-lg mb-4">{rewardEarned.name}</p>
                    <div className="bg-purple-100 text-purple-800 rounded-lg p-4 mb-4 text-xl">
                      🏆 {rewardEarned.name}
                    </div>
                    <p>你的坚持得到了回报！继续保持！</p>
                  </>
                )}
              </div>
            </div>
          )}
          
          <footer className="mt-12 pt-6 border-t text-center text-gray-500 text-sm">
            <p>挑战打卡应用 &copy; 2025</p>
          </footer>
        </>
      )}
    </div>
  );

  {/* Milestones Modal */}
  {showMilestones && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full animate-bounce-in">
        <h3 className="text-2xl font-bold mb-6 text-center">我的成就</h3>
        
        <div className="space-y-4 mb-6">
          {milestones.map((milestone) => (
            <div 
              key={milestone.id}
              className={`p-4 rounded-lg border ${
                milestone.completed 
                  ? 'bg-amber-50 border-amber-300' 
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className="text-2xl mr-3">
                  {milestone.completed ? '🏆' : '🔒'}
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold">{milestone.title}</h4>
                  <p className="text-sm text-gray-600">{milestone.description}</p>
                </div>
                {milestone.completed && (
                  <div className="bg-amber-200 text-amber-800 px-2 py-1 rounded text-xs font-bold">
                    已获得
                  </div>
                )}
              </div>
              {milestone.completed && (
                <div className="mt-2 text-sm bg-white p-2 rounded border border-amber-200">
                  <span className="font-medium">奖励：</span> {milestone.reward}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => setShowMilestones(false)}
          className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          关闭
        </button>
      </div>
    </div>
  )}
}

// Make Challenge App available globally
window.ChallengeApp = ChallengeApp;
