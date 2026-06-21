import React, { useState } from 'react';
import './App.css'; // 아래 가상 스타일시트 참고

// 1. 초기 더미 데이터 (Post 테이블 분해 스펙 반영)
const initialPosts = [
  {
    id: 1,
    title: "기초 미적분학 (Calculus)",
    author: "홍길동",
    isbn: "9788912345678",
    price: 15000,
    tradeType: "판매",
    status: "상",
    tradeStatus: "판매중", // 판매중, 예약중, 거래완료
  },
  {
    id: 2,
    title: "경영학원론",
    author: "이순신",
    isbn: "9788998765432",
    price: 12000,
    tradeType: "대여",
    status: "최상",
    tradeStatus: "예약중",
  }
];

export default function App() {
  const [posts, setPosts] = useState(initialPosts);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "구매자", text: "안녕하세요! 이 책 아직 파시나요?" }
  ]);
  const [newMessage, setNewMessage] = useState("");

  // 2. 도서 검색 기능 분해 (실시간 필터링)
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    post.author.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // 3. 거래 예약 상태 변경 기능 분해 (수업 시간 '자리 예약' 핵심 로직)
  const handleMakePromise = (postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId ? { ...post, tradeStatus: "예약중" } : post
      )
    );
    alert("거래 약속이 신청되었습니다! 상품 상태가 [예약중]으로 변경됩니다.");
    setChatMessages(prev => [...prev, { id: Date.now(), sender: "시스템", text: "📢 판매자가 거래 약속을 신청하여 상태가 [예약중]으로 변경되었습니다." }]);
  };

  const handleCompleteTrade = (postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId ? { ...post, tradeStatus: "거래완료" } : post
      )
    );
    alert("거래가 완료되었습니다! 좋은 하루 되세요.");
    setChatMessages(prev => [...prev, { id: Date.now(), sender: "시스템", text: "🎉 거래가 성공적으로 완료되었습니다!" }]);
  };

  // 메시지 전송
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages(prev => [...prev, { id: Date.now(), sender: "구매자", text: newMessage }]);
    setNewMessage("");
  };

  return (
    <div className="container">
      <header className="header">
        <h1>📚 북캠퍼스 (BookCampus)</h1>
        <p>문제 분해 기반 기말과제 프로토타입 데모</p>
      </header>

      {/* [기능 2.1] 도서 검색 바 컴포넌트 */}
      <section className="search-section">
        <input 
          type="text" 
          placeholder="책 제목 또는 저자를 검색하세요..." 
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="search-bar"
        />
      </section>

      <main className="main-content">
        {/* 도서 목록 리스트 */}
        <section className="list-section">
          <h2>📖 등록된 전공서적 ({filteredPosts.length})</h2>
          <div className="grid">
            {filteredPosts.map(post => (
              <div key={post.id} className="card" onClick={() => setSelectedPost(post)}>
                <h3>{post.title}</h3>
                <p>저자: {post.author} | 상태: {post.status}</p>
                <p className="price">가격: {post.price.toLocaleString()}원 ({post.tradeType})</p>
                
                {/* 상태 배지 컴포넌트 분해 */}
                <span className={`badge ${post.tradeStatus}`}>
                  {post.tradeStatus}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* [기능 2.3] 실시간 채팅 및 거래 예약 인터랙션 컴포넌트 */}
        <section className="chat-section">
          <h2>💬 실시간 대화 및 거래 단계 제어</h2>
          {selectedPost ? (
            <div className="chat-box">
              <div className="chat-info">
                <h4>선택된 도서: {selectedPost.title}</h4>
                <p>현재 상태: <strong>{posts.find(p => p.id === selectedPost.id).tradeStatus}</strong></p>
                
                {/* 버튼 분해: 상태에 따라 유동적 렌더링 */}
                <div className="btn-group">
                  {posts.find(p => p.id === selectedPost.id).tradeStatus === "판매중" && (
                    <button className="btn promise-btn" onClick={() => handleMakePromise(selectedPost.id)}>
                      🤝 거래 약속하기
                    </button>
                  )}
                  {posts.find(p => p.id === selectedPost.id).tradeStatus === "예약중" && (
                    <button className="btn complete-btn" onClick={() => handleCompleteTrade(selectedPost.id)}>
                      ✅ 거래 완료하기
                    </button>
                  )}
                </div>
              </div>

              <div className="message-list">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`message ${msg.sender === "시스템" ? "system" : "user"}`}>
                    <strong>[{msg.sender}]</strong> {msg.text}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="chat-input-form">
                <input 
                  type="text" 
                  value={newMessage} 
                  onChange={(e) => setNewMessage(e.target.value)} 
                  placeholder="메시지를 입력하세요..."
                />
                <button type="submit">전송</button>
              </form>
            </div>
          ) : (
            <p className="placeholder-text">왼쪽에서 책을 선택하면 채팅 및 예약 시뮬레이션이 시작됩니다.</p>
          )}
        </section>
      </main>
    </div>
  );
}
