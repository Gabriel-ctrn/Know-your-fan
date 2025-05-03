import { useState, useEffect } from "react";
import { Match, MatchRating, PlayerRating } from "@shared/schema";

export type LiveMatchUpdate = {
  type: 'live_update';
  matchId: number;
  timestamp: Date;
  averageRating: number;
  matchRatings: MatchRating[];
  playerRatings: PlayerRating[];
}

export type RatingsResponse = {
  type: 'ratings';
  matchRatings: MatchRating[];
  playerRatings: PlayerRating[];
}

export type MatchResponse = {
  type: 'match';
  data: Match;
}

export type WebSocketResponse = LiveMatchUpdate | RatingsResponse | MatchResponse;

export function useLiveMatch() {
  const [match, setMatch] = useState<Match | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [matchRatings, setMatchRatings] = useState<MatchRating[]>([]);
  const [playerRatings, setPlayerRatings] = useState<PlayerRating[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  // Historical ratings for chart data
  const [ratingHistory, setRatingHistory] = useState<{timestamp: Date, average: number}[]>([]);
  
  // Handle WebSocket messages
  const handleWebSocketMessage = (data: WebSocketResponse) => {
    switch (data.type) {
      case 'match':
        setMatch(data.data);
        break;
        
      case 'ratings':
        setMatchRatings(data.matchRatings);
        setPlayerRatings(data.playerRatings);
        break;
        
      case 'live_update':
        setMatchRatings(data.matchRatings);
        setPlayerRatings(data.playerRatings);
        setAverageRating(data.averageRating);
        setLastUpdate(new Date(data.timestamp));
        
        // Add to history
        setRatingHistory(prev => [
          ...prev, 
          { timestamp: new Date(data.timestamp), average: data.averageRating }
        ]);
        break;
    }
  };
  
  // Function to request ratings for a specific match
  const requestRatings = (matchId: number) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'request_ratings',
        matchId
      }));
    } else {
      console.warn('WebSocket not connected, unable to request ratings');
    }
  };
  
  // Handle WebSocket connection
  const handleSocketConnect = (ws: WebSocket) => {
    setSocket(ws);
  };
  
  // Function to fetch current live match
  const fetchLiveMatch = async () => {
    try {
      const response = await fetch('/api/matches/live');
      if (response.ok) {
        const matchData = await response.json();
        setMatch(matchData);
        
        // Request ratings if we have a socket connection
        if (socket && socket.readyState === WebSocket.OPEN && matchData.id) {
          requestRatings(matchData.id);
        }
      } else if (response.status === 404) {
        console.log('No live match found');
      } else {
        console.error('Error fetching live match:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching live match:', error);
    }
  };
  
  // Fetch live match on component mount
  useEffect(() => {
    fetchLiveMatch();
  }, []);
  
  // Request ratings when we have both match and socket
  useEffect(() => {
    if (match && socket && socket.readyState === WebSocket.OPEN) {
      requestRatings(match.id);
    }
  }, [match, socket]);
  
  return {
    match,
    socket,
    matchRatings,
    playerRatings,
    averageRating,
    lastUpdate,
    ratingHistory,
    requestRatings,
    handleSocketConnect,
    handleWebSocketMessage
  };
}