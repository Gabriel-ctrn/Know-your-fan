import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export function UserProfile() {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-furia-red" />
      </div>
    );
  }


  // Format join date as "Member since YYYY"
  const memberSince = "Member since 2024";

  return (
    <div className="relative h-40 md:h-64 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-furia-darkBlue z-10"></div>
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')" }}
      ></div>
      <div className="container mx-auto px-4 relative z-20 h-full flex items-end pb-6">
        <div className="flex items-center">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-furia-red bg-gray-800 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12 text-gray-500">
              <path
                d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h2 className="font-rajdhani font-bold text-2xl text-white">{user.username}</h2>
            <div className="flex items-center">
              <span className="bg-furia-red text-white text-xs px-2 py-1 rounded-full">{user.gamificationLevel || "Irritado"}</span>
              <span className="text-gray-400 text-sm ml-2">{memberSince}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
