"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  CheckCircle,
  ChevronLeft,
  PlayCircle,
  ThumbsUp,
  BookOpen,
  RefreshCcw,
  Bookmark,
  BookmarkPlus,
  StickyNote,
  FileText,
  Moon,
  Sun,
  Trash2,
  Clock,
} from "lucide-react"

// YouTube API type declarations
declare global {
  interface Window {
    YT: {
      Player: new (element: HTMLElement, options: any) => any;
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

// YouTube API types
type YouTubeVideo = {
  id: string
  title: string
  thumbnail: string
  videoUrl: string
  duration: string
  views: string
  channel: string
}

// Function to load YouTube API script
const loadYouTubeAPI = () => {
  if (window.YT) return Promise.resolve()

  return new Promise<void>((resolve) => {
    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    const firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = () => {
      resolve()
    }
  })
}

const isCacheExpired = (topic: string) => {
  const timestamp = localStorage.getItem(`topic-videos-${topic.toLowerCase()}-timestamp`)
  if (!timestamp) return true
  
  const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 1 week
  return Date.now() - parseInt(timestamp) > CACHE_DURATION
}

// Function to fetch videos from YouTube Data API
const fetchVideosForTopic = async (topic: string): Promise<YouTubeVideo[]> => {
  console.log("YouTube Video Query Topic", topic);
  // Check if this is the first load after navigation
  const isFirstLoad = !localStorage.getItem(`visited-${topic.toLowerCase()}`)
  const cacheKey = `topic-videos-${topic.toLowerCase()}`
  
  // If it's not the first load, try to use cached results
  if (!isFirstLoad) {
    const cachedVideos = localStorage.getItem(cacheKey)
    if (cachedVideos && !isCacheExpired(topic)) {
      return JSON.parse(cachedVideos)
    }
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
    if (!apiKey) {
      console.error("YouTube API key is missing")
      return getMockVideos(topic)
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${encodeURIComponent(topic)}&type=video&key=${apiKey}&order=relevance`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch videos")
    }

    const data = await response.json()

    // Get video details
    const videoIds = data.items.map((item: any) => item.id.videoId).join(",")
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${apiKey}`,
    )

    if (!detailsResponse.ok) {
      throw new Error("Failed to fetch video details")
    }

    const detailsData = await detailsResponse.json()

    // Format and store the videos
    const videos = data.items.map((item: any, index: number) => {
      const details = detailsData.items[index]
      const duration = details?.contentDetails?.duration ? formatIsoDuration(details.contentDetails.duration) : "0:00"
      const views = details?.statistics?.viewCount
        ? formatViewCount(Number.parseInt(details.statistics.viewCount))
        : "0"

      return {
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        videoUrl: `https://www.youtube.com/embed/${item.id.videoId}?enablejsapi=1`,
        duration: duration,
        views: views,
        channel: item.snippet.channelTitle,
      }
    })

    // Cache the videos for this topic
    localStorage.setItem(cacheKey, JSON.stringify(videos))
    
    // After successfully fetching videos, mark this topic as visited
    localStorage.setItem(`visited-${topic.toLowerCase()}`, 'true')
    
    return videos

  } catch (error) {
    console.error("Error fetching YouTube videos:", error)
    return getMockVideos(topic)
  }
}

// Helper function to format ISO 8601 duration to minutes:seconds
const formatIsoDuration = (isoDuration: string): string => {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return "0:00"

  const hours = match[1] ? Number.parseInt(match[1]) : 0
  const minutes = match[2] ? Number.parseInt(match[2]) : 0
  const seconds = match[3] ? Number.parseInt(match[3]) : 0

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

// Helper function to format view count
const formatViewCount = (views: number): string => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`
  }
  return views.toString()
}

// Fallback to mock videos if API fails
const getMockVideos = (topic: string): YouTubeVideo[] => {
  return [
    {
      id: "video1",
      title: `${topic} - Fundamentals`,
      thumbnail: "/placeholder.svg?height=120&width=200",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1",
      duration: "10:30",
      views: "120K",
      channel: "Tech Academy",
    },
    {
      id: "video2",
      title: `${topic} - Advanced Concepts`,
      thumbnail: "/placeholder.svg?height=120&width=200",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1",
      duration: "15:45",
      views: "85K",
      channel: "Code Masters",
    },
    {
      id: "video3",
      title: `${topic} - Practical Examples`,
      thumbnail: "/placeholder.svg?height=120&width=200",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1",
      duration: "12:20",
      views: "95K",
      channel: "Dev Tutorials",
    },
    {
      id: "video4",
      title: `${topic} - Tips and Tricks`,
      thumbnail: "/placeholder.svg?height=120&width=200",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1",
      duration: "8:15",
      views: "65K",
      channel: "Programming Hub",
    },
    {
      id: "video5",
      title: `${topic} - Common Mistakes`,
      thumbnail: "/placeholder.svg?height=120&width=200",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1",
      duration: "11:50",
      views: "78K",
      channel: "Code Explained",
    },
  ]
}

// Mock function to generate a summary of the video
const generateVideoSummary = async (videoId: string, topic: string) => {
  const url = `https://youtube-summarizer2.p.rapidapi.com/summarize?id=${videoId}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': ' ', //process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '',
      'x-rapidapi-host': 'youtube-summarizer2.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
    return {
      summary: result.summary
    };
  } catch (error) {
    console.error("Error generating summary:", error);
    // Fallback to mock data if API fails
    return {
      summary: `This video covers the essential concepts of ${topic}. It starts with an introduction to the basic principles and gradually moves into more advanced topics. The instructor explains key techniques, common pitfalls to avoid, and best practices for implementation. Several real-world examples are provided to illustrate how these concepts apply in practical scenarios. The video concludes with recommendations for further learning and practice exercises.`
    };
  }
}

// Add type for the API response
type ApiResponse = {
  success: boolean;
  error?: string;
};

// Update debounce utility function with proper types
const debounce = <T extends (...args: any[]) => Promise<ApiResponse>>(func: T, wait: number) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>): Promise<ApiResponse> => {
    return new Promise((resolve) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(async () => {
        const result = await func(...args);
        resolve(result);
      }, wait);
    });
  };
};

// Update the markTopicAsComplete function with proper return type
const markTopicAsComplete = async (topic: string, isCompleted: boolean): Promise<ApiResponse> => {
  try {
    // The topic string will be in format "Course Name+sep+Topic Name"
    const [courseName, topicName] = topic.split('+sep+');
    
    if (!courseName || !topicName) {
      console.error('Invalid topic format:', topic);
      return { success: false, error: 'Invalid topic format' };
    }
    // Prepare the data to send to the API
    const data = {
      topicName: topicName,
      isCompleted: isCompleted
    }

    console.log('Sending completion update:', {
      originalTopic: topic,
      parsedData: data
    });

    // Make the API call to update the completion status
    const response = await fetch('/api/topics/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    const responseData = await response.json();
    console.log('Received response:', responseData);

    if (!response.ok) {
      throw new Error(responseData.error || 'Failed to update completion status');
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating topic completion:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update completion status' };
  }
}

// Create a debounced version of the API call with proper typing
const debouncedMarkTopicAsComplete: (topic: string, isCompleted: boolean) => Promise<ApiResponse> = 
  debounce(markTopicAsComplete, 1000);

// Type definitions
type VideoBookmark = {
  id: string
  time: string
  label: string
  timestamp: number
}

type Note = {
  id: string
  content: string
  timestamp: string
}

export default function LearningPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // State to track if we're ready to fetch videos
  const [isInitialized, setIsInitialized] = useState(false)
  const [topic, setTopic] = useState<string>("")
  
  // Move topic extraction to useEffect to ensure it runs after component mount
  useEffect(() => {
    const pathSegments = window.location.pathname.split('/')
    const encodedTopic = pathSegments[pathSegments.length - 1]
    const decodedTopic = decodeURIComponent(encodedTopic)
    setTopic(decodedTopic)
    setIsInitialized(true)
  }, [])

  const day = searchParams.get("day") || "1"
  
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState<{ summary: string } | null>(null)
  const [isSummaryLoading, setIsSummaryLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [bookmarks, setBookmarks] = useState<VideoBookmark[]>([])
  const [newBookmarkLabel, setNewBookmarkLabel] = useState("")
  const [newBookmarkTime, setNewBookmarkTime] = useState("0:00")
  const [notes, setNotes] = useState<Note[]>([])
  const [currentNote, setCurrentNote] = useState("")
  const [activeTab, setActiveTab] = useState("notes")
  const [player, setPlayer] = useState<any>(null)
  const [apiLoaded, setApiLoaded] = useState(false)
  const [isRefreshingVideos, setIsRefreshingVideos] = useState(false)

  // Refs
  const notesRef = useRef<HTMLTextAreaElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Load YouTube API
    const loadAPI = async () => {
      try {
        await loadYouTubeAPI()
        setApiLoaded(true)
      } catch (error) {
        console.error("Failed to load YouTube API:", error)
      }
    }

    loadAPI()

    // Update the video loading useEffect to depend on isInitialized
    const loadVideos = async () => {
      if (!isInitialized || !topic) return; // Don't proceed if not initialized
      
      setIsLoading(true)
      try {
        // Use the search query function here
        const searchQuery = getSearchQuery(topic)
        const fetchedVideos = await fetchVideosForTopic(searchQuery)
        setVideos(fetchedVideos)
        setSelectedVideo(fetchedVideos[0])
      } catch (error) {
        console.error("Error loading videos:", error)
        setVideos(getMockVideos(topic))
      } finally {
        setIsLoading(false)
      }
    }

    loadVideos()

    // Check if topic is completed from localStorage
    const completedTopics = JSON.parse(localStorage.getItem("completedTopics") || "{}")
    setIsCompleted(!!completedTopics[topic])
  }, [topic, isInitialized])

  useEffect(() => {
    if (selectedVideo) {
      loadSummary()

      // Load saved notes and bookmarks from localStorage
      const savedNotes = localStorage.getItem(`notes-${selectedVideo.id}`)
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes))
      } else {
        setNotes([])
      }

      const savedBookmarks = localStorage.getItem(`bookmarks-${selectedVideo.id}`)
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks))
      } else {
        setBookmarks([])
      }

      // Initialize YouTube player if API is loaded
      if (apiLoaded && playerRef.current) {
        // Destroy previous player if exists
        if (player) {
          player.destroy()
        }

        // Create new player
        const newPlayer = new window.YT.Player(playerRef.current, {
          videoId: selectedVideo.id,
          playerVars: {
            autoplay: 0,
            controls: 1,
            rel: 0,
            modestbranding: 1,
          },
          events: {
            onReady: (event: any) => {
              console.log("Player ready")
            },
            onStateChange: (event: any) => {
              // You can track video state changes here
              // 0: ended, 1: playing, 2: paused, 3: buffering, 5: video cued
            },
            onError: (event: any) => {
              console.error("Player error:", event)
            },
          },
        })

        setPlayer(newPlayer)
      }
    }
  }, [selectedVideo, apiLoaded])

  const loadSummary = async () => {
    if (!selectedVideo) return

    setIsSummaryLoading(true)
    setSummary(null)
    try {
      const videoSummary = await generateVideoSummary(selectedVideo.id, topic)
      setSummary(videoSummary)
    } catch (error) {
      console.error("Failed to generate summary:", error)
    } finally {
      setIsSummaryLoading(false)
    }
  }

  const handleBackToCalendar = () => {
    router.push("/dashboard/calendar")
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", String(newDarkMode))

    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const addBookmark = () => {
    if (!selectedVideo || !newBookmarkLabel.trim()) return

    const newBookmark: VideoBookmark = {
      id: Date.now().toString(),
      time: newBookmarkTime,
      label: newBookmarkLabel,
      timestamp: convertTimeToSeconds(newBookmarkTime),
    }

    const updatedBookmarks = [...bookmarks, newBookmark].sort((a, b) => a.timestamp - b.timestamp)
    setBookmarks(updatedBookmarks)
    localStorage.setItem(`bookmarks-${selectedVideo.id}`, JSON.stringify(updatedBookmarks))

    setNewBookmarkLabel("")
    setNewBookmarkTime("0:00")
  }

  const deleteBookmark = (id: string) => {
    if (!selectedVideo) return

    const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id)
    setBookmarks(updatedBookmarks)
    localStorage.setItem(`bookmarks-${selectedVideo.id}`, JSON.stringify(updatedBookmarks))
  }

  const saveNote = () => {
    if (!selectedVideo || !currentNote.trim()) return

    const newNote: Note = {
      id: Date.now().toString(),
      content: currentNote,
      timestamp: new Date().toLocaleString(),
    }

    const updatedNotes = [...notes, newNote]
    setNotes(updatedNotes)
    localStorage.setItem(`notes-${selectedVideo.id}`, JSON.stringify(updatedNotes))

    setCurrentNote("")
  }

  const deleteNote = (id: string) => {
    if (!selectedVideo) return

    const updatedNotes = notes.filter((note) => note.id !== id)
    setNotes(updatedNotes)
    localStorage.setItem(`notes-${selectedVideo.id}`, JSON.stringify(updatedNotes))
  }

  const convertTimeToSeconds = (timeString: string): number => {
    const parts = timeString.split(":")
    if (parts.length === 2) {
      return Number.parseInt(parts[0]) * 60 + Number.parseInt(parts[1])
    }
    if (parts.length === 3) {
      return Number.parseInt(parts[0]) * 3600 + Number.parseInt(parts[1]) * 60 + Number.parseInt(parts[2])
    }
    return 0
  }

  const seekToTime = (timeString: string) => {
    if (player && player.seekTo) {
      const seconds = convertTimeToSeconds(timeString)
      player.seekTo(seconds, true)
      player.playVideo()
    }
  }

  const handleRefreshVideos = async () => {
    setIsRefreshingVideos(true)
    
    try {
      // Clear the cache for this topic
      const cacheKey = `topic-videos-${topic.toLowerCase()}`
      localStorage.removeItem(cacheKey)
      localStorage.removeItem(`${cacheKey}-timestamp`)
      
      // Fetch fresh videos
      const freshVideos = await fetchVideosForTopic(topic)
      setVideos(freshVideos)
      setSelectedVideo(freshVideos[0])
    } catch (error) {
      console.error("Error refreshing videos:", error)
    } finally {
      setIsRefreshingVideos(false)
    }
  }

  // Add this function to better extract topic information
  const getDisplayTopic = (fullTopic: string) => {
    // Split by the separator keyword
    const parts = fullTopic.split('+sep+')
    
    // If we have parts after splitting, take the last part (the sub-topic)
    if (parts.length > 1) {
      const subTopic = parts[1]
      // Clean up and capitalize each word
      return subTopic
        .split('+')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }
    
    // Fallback: if no separator is found, just clean and return the whole topic
    return fullTopic
      .split('+')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Add this function to get the search query for YouTube
  const getSearchQuery = (fullTopic: string) => {
    // Split by the separator keyword
    const parts = fullTopic.split('+sep+')
    
    if (parts.length === 1) {
      const [courseName, subTopic] = parts
      // Add both course name and sub-topic for better context in search
      return `${subTopic}+${courseName}`
    }
    else if(parts.length > 1){
      const parts = fullTopic.split('+sep+')
    
      const [courseName, subTopic] = parts
      // Add both course name and sub-topic for better context in search
      return `${subTopic}+${courseName}`
    }
    
    // Fallback: use the full topic if no separator is found
    return `${fullTopic}`
  }

  // Update the handleMarkComplete function with proper types
  const handleMarkComplete = async () => {
    try {
      const newCompletionState = !isCompleted;
      const displayTopic = getDisplayTopic(topic);
                    
      // Immediately update UI state
      setIsCompleted(newCompletionState);
      
      // Update local storage immediately for UI consistency
      const completedTopics = JSON.parse(localStorage.getItem("completedTopics") || "{}");
      if (newCompletionState) {
        completedTopics[topic] = {
          completedAt: new Date().toISOString(),
          topicName: displayTopic
        };
      } else {
        delete completedTopics[topic];
      }
      localStorage.setItem("completedTopics", JSON.stringify(completedTopics));
      
      // Make debounced API call in the background
      debouncedMarkTopicAsComplete(topic, newCompletionState)
        .then((result: ApiResponse) => {
          if (!result.success) {
            // If API call fails, revert the UI state
            setIsCompleted(!newCompletionState);
            const revertedTopics = JSON.parse(localStorage.getItem("completedTopics") || "{}");
            if (!newCompletionState) {
              revertedTopics[topic] = {
                completedAt: new Date().toISOString(),
                topicName: displayTopic
              };
            } else {
              delete revertedTopics[topic];
            }
            localStorage.setItem("completedTopics", JSON.stringify(revertedTopics));
            
            // You might want to show an error toast/notification here
            console.error('Failed to update completion status:', result.error);
          }
        })
        .catch((error: Error) => {
          // Handle any unexpected errors
          console.error('Unexpected error:', error);
          // Revert UI state on error
          setIsCompleted(!newCompletionState);
          const revertedTopics = JSON.parse(localStorage.getItem("completedTopics") || "{}");
          if (!newCompletionState) {
            revertedTopics[topic] = {
              completedAt: new Date().toISOString(),
              topicName: displayTopic
            };
          } else {
            delete revertedTopics[topic];
          }
          localStorage.setItem("completedTopics", JSON.stringify(revertedTopics));
        });
    } catch (error) {
      console.error('Error in handleMarkComplete:', error);
    }
  };

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br ${darkMode ? "from-gray-900 via-indigo-900 to-purple-900" : "from-indigo-50 via-purple-50 to-pink-50"}`}
    >
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob ${darkMode ? "bg-indigo-700" : "bg-indigo-300"}`}
        ></div>
        <div
          className={`absolute top-1/3 right-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 ${darkMode ? "bg-purple-700" : "bg-purple-300"}`}
        ></div>
        <div
          className={`absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 ${darkMode ? "bg-blue-700" : "bg-pink-300"}`}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative min-h-screen w-full">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                className={`mr-2 ${darkMode ? "text-white hover:bg-gray-800" : ""}`}
                onClick={handleBackToCalendar}
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Back to Calendar
              </Button>
              <Badge className={`${darkMode ? "bg-indigo-100 text-purple-600" : "bg-indigo-100 text-indigo-600"} mr-2`}>
                Day {day}
              </Badge>
              <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-indigo-900"}`}>
                {getDisplayTopic(topic)}
              </h1>
              {isCompleted && (
                <Badge className={`ml-3 ${darkMode ? "bg-green-800 text-green-200" : "bg-green-100 text-green-600"}`}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-2 mr-4">
                <Sun className={`h-4 w-4 ${darkMode ? "text-gray-400" : "text-amber-500"}`} />
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} id="dark-mode" />
                <Moon className={`h-4 w-4 ${darkMode ? "text-indigo-300" : "text-gray-400"}`} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main video player - takes up 2/3 of the width on large screens */}
            <Card
              className={`lg:col-span-2 ${darkMode ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-indigo-100/50"} backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden`}
            >
              <CardHeader
                className={`border-b ${darkMode ? "border-gray-700 bg-gradient-to-r from-indigo-900 to-purple-900" : "border-indigo-100/50 bg-gradient-to-r from-indigo-500 to-purple-600"}`}
              >
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Now Playing: {selectedVideo?.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Skeleton className="h-12 w-12 rounded-full" />
                  </div>
                ) : (
                  selectedVideo && (
                    <div className="aspect-video w-full">
                      {apiLoaded ? (
                        <div id="youtube-player" ref={playerRef} className="w-full h-full"></div>
                      ) : (
                        <iframe
                          src={selectedVideo.videoUrl}
                          className="w-full h-full"
                          title={selectedVideo.title}
                          allowFullScreen
                        ></iframe>
                      )}
                    </div>
                  )
                )}
              </CardContent>
              <CardFooter className={`p-4 flex justify-between items-center ${darkMode ? "text-white" : ""}`}>
                <div>
                  <h3 className="font-semibold text-lg">{selectedVideo?.title}</h3>
                  <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
                    {selectedVideo?.channel} • {selectedVideo?.views} views
                  </p>
                </div>
                <Button
                  className={`${isCompleted ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"} text-white`}
                  onClick={handleMarkComplete}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Completed
                    </>
                  ) : (
                    <>
                      <ThumbsUp className="mr-2 h-5 w-5" />
                      Mark as Complete
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Sidebar with tabs for notes and bookmarks - takes up 1/3 of the width */}
            <Card
              className={`${darkMode ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-indigo-100/50"} backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden`}
            >
              <div className="h-full flex flex-col">
                <Tabs
                  defaultValue="notes"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="h-full flex flex-col"
                >
                  <div className={`py-3 px-4 border-b ${darkMode ? "border-gray-700" : "border-indigo-100/50"}`}>
                    <TabsList className="grid grid-cols-2 w-full">
                      <TabsTrigger value="notes" className={darkMode ? "data-[state=active]:bg-gray-700" : ""}>
                        <StickyNote className="h-4 w-4 mr-1" />
                        Notes
                      </TabsTrigger>
                      <TabsTrigger value="bookmarks" className={darkMode ? "data-[state=active]:bg-gray-700" : ""}>
                        <Bookmark className="h-4 w-4 mr-1" />
                        Bookmarks
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <TabsContent value="notes" className="m-0 h-full">
                      <div className={`p-4 ${darkMode ? "text-gray-200" : ""} h-full`}>
                        <h3 className="text-lg font-medium mb-3">Your Notes</h3>
                        <div className="mb-4">
                          <Textarea
                            ref={notesRef}
                            placeholder="Write your notes here..."
                            className={`min-h-[120px] ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                            value={currentNote}
                            onChange={(e) => setCurrentNote(e.target.value)}
                          />
                          <Button className="mt-2 w-full" onClick={saveNote} disabled={!currentNote.trim()}>
                            Save Note
                          </Button>
                        </div>

                        <Separator className={`my-4 ${darkMode ? "bg-gray-700" : ""}`} />

                        <h4 className="font-medium mb-2">Saved Notes</h4>
                        {notes.length > 0 ? (
                          <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-3">
                              {notes.map((note) => (
                                <div
                                  key={note.id}
                                  className={`p-3 rounded-md ${darkMode ? "bg-gray-700" : "bg-gray-50"} relative group`}
                                >
                                  <p className="whitespace-pre-wrap mb-2">{note.content}</p>
                                  <div
                                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} flex justify-between items-center`}
                                  >
                                    <span>{note.timestamp}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => deleteNote(note.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        ) : (
                          <p className={`text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            No notes saved yet. Start taking notes above!
                          </p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="bookmarks" className="m-0 h-full">
                      <div className={`p-4 ${darkMode ? "text-gray-200" : ""} h-full`}>
                        <h3 className="text-lg font-medium mb-3">Video Bookmarks</h3>
                        <div className="mb-4 flex space-x-2">
                          <div className="flex-1">
                            <Input
                              placeholder="Bookmark label"
                              className={darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                              value={newBookmarkLabel}
                              onChange={(e) => setNewBookmarkLabel(e.target.value)}
                            />
                          </div>
                          <div className="w-20">
                            <Input
                              placeholder="0:00"
                              className={darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                              value={newBookmarkTime}
                              onChange={(e) => setNewBookmarkTime(e.target.value)}
                            />
                          </div>
                          <Button size="icon" onClick={addBookmark} disabled={!newBookmarkLabel.trim()}>
                            <BookmarkPlus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Separator className={`my-4 ${darkMode ? "bg-gray-700" : ""}`} />

                        <h4 className="font-medium mb-2">Saved Bookmarks</h4>
                        {bookmarks.length > 0 ? (
                          <ScrollArea className="h-[350px] pr-4">
                            <div className="space-y-2">
                              {bookmarks.map((bookmark) => (
                                <div
                                  key={bookmark.id}
                                  className={`p-3 rounded-md ${darkMode ? "bg-gray-700" : "bg-gray-50"} flex items-center justify-between group cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600`}
                                  onClick={() => seekToTime(bookmark.time)}
                                >
                                  <div className="flex items-center">
                                    <Badge
                                      className={`mr-2 ${darkMode ? "bg-indigo-800 text-indigo-200" : "bg-indigo-100 text-indigo-600"}`}
                                    >
                                      <Clock className="h-3 w-3 mr-1" />
                                      {bookmark.time}
                                    </Badge>
                                    <span>{bookmark.label}</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      deleteBookmark(bookmark.id)
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        ) : (
                          <p className={`text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            No bookmarks saved yet. Add a bookmark above!
                          </p>
                        )}
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </Card>

            {/* Video grid */}
            <Card
              className={`lg:col-span-2 ${darkMode ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-indigo-100/50"} backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden`}
            >
              <CardHeader className={`border-b py-3 ${darkMode ? "border-gray-700" : "border-indigo-100/50"} flex flex-row items-center justify-between`}>
                <CardTitle className={`text-lg font-semibold ${darkMode ? "text-white" : "text-indigo-900"}`}>
                  Related Videos
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefreshVideos}
                  disabled={isRefreshingVideos}
                  className={`h-8 ${darkMode ? "text-white hover:bg-gray-700" : "hover:bg-indigo-100"}`}
                >
                  <RefreshCcw 
                    className={`h-4 w-4 mr-2 ${isRefreshingVideos ? "animate-spin" : ""}`} 
                  />
                  {isRefreshingVideos ? "Refreshing..." : "Refresh Videos"}
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-full">
                        <Skeleton className="h-[112px] w-full rounded-md mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        className={`w-full cursor-pointer transition-all duration-200 ${selectedVideo?.id === video.id ? `ring-2 ${darkMode ? "ring-indigo-400" : "ring-indigo-500"} scale-[1.02]` : "hover:scale-[1.02]"}`}
                        onClick={() => setSelectedVideo(video)}
                      >
                        <div className="rounded-md overflow-hidden relative">
                          <img
                            src={video.thumbnail || "/placeholder.svg"}
                            alt={video.title}
                            className="object-cover aspect-video w-full"
                          />
                          <div className={`absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded`}>
                            {video.duration}
                          </div>
                          {selectedVideo?.id === video.id && (
                            <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                              <PlayCircle className="h-10 w-10 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="mt-2">
                          <h3 className={`text-sm font-medium line-clamp-2 ${darkMode ? "text-white" : ""}`}>
                            {video.title}
                          </h3>
                          <p className={`text-xs ${darkMode ? "text-gray-300" : "text-gray-500"}`}>{video.channel}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Video summary */}
            <Card
              className={`${darkMode ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-indigo-100/50"} backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden`}
            >
              <CardHeader
                className={`border-b py-3 flex flex-row items-center justify-between ${darkMode ? "border-gray-700" : "border-indigo-100/50"}`}
              >
                <CardTitle
                  className={`text-lg font-semibold ${darkMode ? "text-white" : "text-indigo-900"} flex items-center`}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Video Summary
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadSummary}
                  disabled={isSummaryLoading}
                  className={`h-8 ${darkMode ? "border-gray-600 hover:bg-gray-700" : ""}`}
                >
                  <RefreshCcw className={`h-4 w-4 mr-1 ${isSummaryLoading ? "animate-spin" : ""}`} />
                  Regenerate
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                {isSummaryLoading ? (
                  <div className="space-y-4">
                    <Skeleton className={`h-4 w-full ${darkMode ? "bg-gray-700" : ""}`} />
                    <Skeleton className={`h-4 w-full ${darkMode ? "bg-gray-700" : ""}`} />
                    <Skeleton className={`h-4 w-3/4 ${darkMode ? "bg-gray-700" : ""}`} />
                    <div className="mt-6">
                      <Skeleton className={`h-4 w-1/2 mb-3 ${darkMode ? "bg-gray-700" : ""}`} />
                      <Skeleton className={`h-3 w-full mb-2 ${darkMode ? "bg-gray-700" : ""}`} />
                      <Skeleton className={`h-3 w-full mb-2 ${darkMode ? "bg-gray-700" : ""}`} />
                      <Skeleton className={`h-3 w-full mb-2 ${darkMode ? "bg-gray-700" : ""}`} />
                      <Skeleton className={`h-3 w-3/4 ${darkMode ? "bg-gray-700" : ""}`} />
                    </div>
                  </div>
                ) : summary ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className={`text-lg font-medium mb-2 ${darkMode ? "text-white" : ""}`}>Overview</h3>
                      <p className={darkMode ? "text-gray-300" : "text-gray-700"}>{summary.summary}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                      Summary not available. Click "Regenerate" to create a summary.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

