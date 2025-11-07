import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const APIBASEURL = 'http://localhost:8080/api/v1'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      fetchUserInfo(storedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUserInfo = async (authToken: string) => {
    try {
      const response = await fetch(`${APIBASEURL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
      } else {
        localStorage.removeItem('token')
        setToken(null)
      }
    } catch (error) {
      console.error('Error fetching user info:', error)
      localStorage.removeItem('token')
      setToken(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      console.log(' Sending login request to:', `${APIBASEURL}/auth/login`)
      
      const response = await fetch(`${APIBASEURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      console.log(' Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log(' Login successful:', data)

      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUser(data.user)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      console.error(' Login error:', message)
      toast.error(`Login failed: ${message}`)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      console.log(' Sending registration request to:', `${APIBASEURL}/auth/register`)
      
      const response = await fetch(`${APIBASEURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      })

      console.log(' Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log(' Registration successful:', data)

      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUser(data.user)
      
      toast.success('Registration successful! Welcome aboard!')
      navigate('/dashboard')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed'
      console.error(' Registration error:', message)
      toast.error(`Registration failed: ${message}`)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
