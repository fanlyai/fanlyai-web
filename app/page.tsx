"use client";
import Image from "next/image";
import useState from "react-usestateref";
import userPic from "../public/user.png";
import botPic from "../public/logo.png";
import { Josefin_Sans } from "next/font/google";
const manrope = Josefin_Sans({ weight: "400", subsets: ["latin"] });

enum Creator {
  Me = 0,
  Bot = 1,
}

interface MessageProps {
  text: string;
  from: Creator;
  key: number;
}

interface InputProps {
  onSend: (input: string) => void;
  disabled: boolean;
}

const ChatMessage = ({ text, from }: MessageProps) => {
  return (
    <div className="z-10">
      {from == Creator.Me && (
        <div className="bg-[#00AFF090] relative z-10 p-4 my-4 rounded-lg flex gap-4 items-center whitespace-pre-wrap">
          <Image src={userPic} alt="User" className="rounded-full" width={40} />
          <p className="text-white">{text}</p>
        </div>
      )}
      {from == Creator.Bot && (
        <div className="bg-[#27272B80] p-4 z-10 rounded-lg flex gap-4 items-center whitespace-pre-wrap">
          <Image src={botPic} alt="User" className="bg-white rounded-full" width={40} />
          <p className="text-white">{text}</p>
        </div>
      )}
    </div>
  );
};

const ChatInput = ({ onSend, disabled }: InputProps) => {
  const [input, setInput] = useState("");

  const sendInput = () => {
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      sendInput();
    }
  };

  return (
    <div className="bg-black  p-2 rounded-lg flex justify-center">
      <input
        value={input}
        onChange={(e: any) => setInput(e.target.value)}
        className="w-full py-2 px-3 text-black border-4 border-[#00AFF0] bg-white rounded-lg focus:outline-none"
        type="text"
        placeholder="Talk with FanlyAI!"
        disabled={disabled}
        onKeyDown={(e) => handleKeyDown(e)}
      />
     

      {!disabled && (
        <button
          onClick={() => sendInput()}
          className="p-2 rounded-md text-gray-500 bottom-1.5 right-1"
        >
         
        </button>
      )}
    </div>
  );
};

export default function Home() {
  const [messages, setMessages, messagesRef] = useState<MessageProps[]>([]);
  const [loading, setLoading] = useState(false);

  const callApi = async (input: string) => {
    setLoading(true);

    const myMessage: MessageProps = {
      text: input,
      from: Creator.Me,
      key: new Date().getTime(),
    };

    setMessages([...messagesRef.current, myMessage]);
    const response = await fetch("/api/generate-answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
      }),
    }).then((response) => response.json());
    setLoading(false);

    if (response.text) {
      const botMessage: MessageProps = {
        text: response.text,
        from: Creator.Bot,
        key: new Date().getTime(),
      };
      setMessages([...messagesRef.current, botMessage]);
    } else {
    }
  };

  return (
    <main className="bg-black min-w-screen md:px-36 min-h-screen  bg-cover  mx-auto">
      <div className="w-full flex flex-col items-center justify-center">
        <Image src={botPic} alt="logo" width={400} className="py-4"></Image>
        <div className={manrope.className}>
          <div className="text-white text-xl">BETA</div>
        </div>
      </div>
     
      <Image src="/ormblue.png" alt="orm" className="absolute opacity-50 left-[-80px] block z-0 top-20 " width={800} height={300}></Image>
      <div className="sticky top-0 w-full pt-10 px-4">
        <ChatInput
          onSend={(input) => callApi(input)}
          disabled={loading}
        ></ChatInput>
      </div>
      <div className="mt-10 flex flex-col z-10 px-4">
        {messages.map((msg: MessageProps) => (
          <ChatMessage key={msg.key} text={msg.text} from={msg.from} />
        ))}
        {messages.length == 0 && (
          <div className="flex w-full justify-center items-center">
            <div className="bg-green-600 w-2 h-2 rounded-full pr-2"></div>
            <p className="text-center text-gray-400">Online</p>
          </div>
        )}
      </div>
    </main>
  );
}
