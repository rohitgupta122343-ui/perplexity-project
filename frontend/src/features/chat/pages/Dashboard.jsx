import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hook/useChat";
import { useAuth } from "../../auth/hook/useAuth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { setCurrentChatId } from "../chat.slice";
import { useDispatch } from "react-redux";

const Dashboard = () => {
  const dispatch = useDispatch();

  const chat = useChat();
  const { handleLogout } = useAuth();

  const [chatInput, setChatInput] = useState("");

  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);

  const user = useSelector((state) => state.auth.user);

  const { handleCreateChat } = useChat();

  useEffect(() => {
    chat.initSocket();
    chat.handleGetChats();
  }, []);

  const handleSubmitMessage = (event) => {
    event.preventDefault();

    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) {
      return;
    }

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId });
    setChatInput("");
    streamResponse(chat.reply);
  };

  function openChat(chatId) {
    chat.handleOpenChat(chatId, chats);
    console.log(chatId);
  }
  const streamResponse = (text) => {
    let index = 0;

    setStreamText("");

    const interval = setInterval(() => {
      setStreamText((prev) => prev + text[index]);
      index++;

      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 20); // speed control
  };

  return (
    <main className="min-h-screen w-full bg-[#050505]  text-white ">
     <section className="mx-auto flex h-screen w-full rounded-3xl border-none">
       <button
  onClick={() => setIsOpen(true)}
  className="md:hidden fixed top-4 left-4 z-50 rounded-lg bg-white/10 p-2 text-white"
>
  ☰
</button>

{/* OVERLAY */}
{isOpen && (
  <div
    onClick={() => setIsOpen(false)}
    className="fixed inset-0 z-30 bg-black/50 md:hidden"
  />
)}
        <aside
          className={`fixed z-40 h-full w-72 transform border-r border-white/10 bg-[#070b17] transition-transform duration-300
  ${isOpen ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0 md:static`}
        >
           {/* CLOSE BUTTON */}
  <button
    onClick={() => setIsOpen(false)}
    className="md:hidden absolute right-4 top-4 z-50 text-2xl text-white"
  >
    ✕
  </button>

          {/* BACKGROUND GLOW */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-0 top-0 h-64 w-64 bg-blue-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 bg-violet-500/10 blur-3xl" />
          </div>

          {/* CONTENT */}
          <div className="relative z-10 flex h-full flex-col">
            {/* TOP */}
            <div className="border-b border-white/10 px-4 py-5">
              {/* LOGO */}
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-lg">
                  ⚡
                </div>

                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-white">
                    Perplexity AI 
                  </h1>

                  <p className="text-xs text-white/40">AI Assistant</p>
                </div>
              </div>

              {/* SEARCH */}
              <div className="mb-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="text-white/40"
                >
                  <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168Z"></path>
                </svg>

                <input
                  type="text"
                  placeholder="Search chats"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                />
              </div>

              {/* NEW CHAT */}
              <button
                onClick={() => {
                  dispatch(setCurrentChatId(null));
                }}
                className="cursor-pointer flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80 transition hover:bg-white/[0.06] hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="17"
                  height="17"
                  fill="currentColor"
                >
                  <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                </svg>

                <span>New Chat</span>
              </button>
            </div>

            {/* CHATS */}
            <div className="custom-scroll flex-1 overflow-y-auto px-3 py-4">
              <div className="mb-3 px-2 text-xs font-medium uppercase tracking-wider text-white/30">
                Recent Chats
              </div>

              <div className="space-y-2">
                {Object.values(chats).map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => openChat(chat.id)}
                    className={`group w-full rounded-2xl px-4 py-3 text-left transition ${chat.id === currentChatId
                      ? "border border-white/10 bg-white/[0.08] shadow-lg"
                      : "hover:bg-white/[0.04]"
                      }`}
                  >
                    <div
                      className={`truncate text-sm ${chat.id === currentChatId
                        ? "text-white"
                        : "text-white/65 group-hover:text-white"
                        }`}
                    >
                      {chat.title || "New Chat"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* PROFILE */}
            <div
              onClick={() => {
                setOpen(true);
              }}
              className="sidebar border-t border-white/10 p-4"
            >
              <div className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 transition hover:bg-white/[0.06]">
                {/* AVATAR */}
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 font-semibold text-black shadow-lg">
                  {user.username[0].toUpperCase()}
                </div>

                {/* USER */}
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate text-sm font-medium text-white">
                    {user.username}
                  </span>

                  <span className="truncate text-xs text-white/40">
                    {user.email}
                  </span>
                </div>
              </div>

              {open && (
                <div className="hero absolute  w-[200px] bg-[#050817] p-3 rounded-lg  flex flex-col gap-3 text-sm font-light text-white/80 shadow-lg bottom-[90px]">
                  <p>
                    <i class="ri-bard-line"></i> Upgarde Plan
                  </p>
                  <hr className="opacity-12" />
                  <p>
                    <i class="ri-user-line"></i> Profile
                  </p>
                  <p>
                    <i class="ri-settings-3-line"></i> Settings
                  </p>
                  <hr className="opacity-12" />
                  <p>
                    <i class="ri-question-line"></i> Help
                  </p>
                  <p className="cursor-pointer" onClick={() => logout()}>
                    <i class="ri-logout-box-r-line"></i> Logout
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {open && (
          <div onClick={() => setOpen(false)} className="fixed inset-0 z-40">
            <div className="hero absolute left-[15px]   w-[200px] bg-[#050817] p-3 rounded-lg  flex flex-col gap-3 text-sm font-light text-white/80 shadow-lg bottom-[80px]">
              <p>
                <i class="ri-bard-line"></i> Upgarde Plan
              </p>
              <hr className="opacity-12" />
              <p>
                <i class="ri-user-line"></i> Profile
              </p>
              <p>
                <i class="ri-settings-3-line"></i> Settings
              </p>
              <hr className="opacity-12" />
              <p>
                <i class="ri-question-line"></i> Help
              </p>
              <p className="cursor-pointer" onClick={() => handleLogout()}>
                <i class="ri-logout-box-r-line"></i> Logout
              </p>
            </div>
          </div>
        )}

       

        <section className="chat-main relative flex flex-1 flex-col overflow-hidden bg-[#050816] sm:w-0.5 md:w-auto ">
          {/* BACKGROUND EFFECT */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-32 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[140px]" />
            <div className="absolute bottom-0 left-0 h-[300px] w-[300px] bg-violet-500/10 blur-[120px]" />
          </div>

          {/* CHAT AREA */}
          <div className="chat-conatiner custom-scroll relative flex-1 overflow-y-auto px-6 py-8">
            <div className="mx-auto flex w-full max-w-4xl flex-col">
              {/* EMPTY SCREEN */}
              {(!chats[currentChatId]?.messages ||
                chats[currentChatId]?.messages.length === 0) && (
                  <div className="mt-20 flex flex-col items-center justify-center">
                    {/* GLOW BALL */}
                    <div className="relative mb-8">
                      <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-3xl" />

                      <div className="relative h-28 w-28 rounded-full border border-white/20 bg-gradient-to-br from-pink-300 via-blue-300 to-violet-400 shadow-2xl" />
                    </div>

                    <h1 className="welcome-title text-center text-5xl font-light leading-tight text-white">
                      Welcome, {user.username}!
                    </h1>

                    <p className="welcome-subtitle mt-3 text-center text-lg text-white/50">
                      Can I help you with anything?
                    </p>
                  </div>
                )}

              {/* MESSAGES */}
              <div className="mt-10 flex flex-col gap-6 pb-24 sm">
                {chats[currentChatId]?.messages.map((message, index) => (
                  <div
                    key={message.id || index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div
                      className={`lg:max-w-3xl rounded-3xl px-5 py-4 text-[15px] leading-7 backdrop-blur-xl ${message.role === "user"
                        ? "bg-white/10 text-white"
                        : "border border-white/10 bg-white/[0.03] text-white/90"
                        }`}
                    >
                      {message.role === "user" ? (
                        <p>{message.content}</p>
                      ) : (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => (
                              <p className="mb-3 last:mb-0">{children}</p>
                            ),

                            ul: ({ children }) => (
                              <ul className="mb-3 list-disc pl-5">
                                {children}
                              </ul>
                            ),

                            ol: ({ children }) => (
                              <ol className="mb-3 list-decimal pl-5">
                                {children}
                              </ol>
                            ),

                            code: ({ children }) => (
                              <code className="rounded-lg bg-black/40 px-1.5 py-1 text-sm text-blue-300">
                                {children}
                              </code>
                            ),

                            pre: ({ children }) => (
                              <pre className="mb-4 overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-4">
                                {children}
                              </pre>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* INPUT */}
          <div className="chat-footer w-full px-6 pb-8 ">
            <div className="mx-auto max-w-4xl">
              <footer className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl ">
                <form
                  onSubmit={handleSubmitMessage}
                  className="flex flex-col gap-5"
                >
                  {/* INPUT */}
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    placeholder="Ask anything"
                    className="chat-input w-full bg-transparent text-lg text-white outline-none placeholder:text-white/35 sm:text-xl"
                  />

                  {/* ACTIONS */}
                  <div className="chat-actions flex items-center justify-between ">
                    <div className="chat-actions-left flex items-center gap-3">
                      <button
                        type="button"
                        className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
                      >
                        Create image
                      </button>

                      <button
                        type="button"
                        className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
                      >
                        Search web
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="send-btn flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 disabled:opacity-40"
                    >
                      ↑
                    </button>
                  </div>
                </form>
              </footer>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
