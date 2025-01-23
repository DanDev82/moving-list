import { useState, useMemo, useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import { AddBoxForm } from './components/AddBoxForm'
import { AddItemForm } from './components/AddItemForm'
import { BoxList } from './components/BoxList'
import { SearchBar } from './components/SearchBar'
import { Auth } from './components/Auth'
import { supabase } from './lib/supabase'
import './App.css'

interface Box {
  id: string
  name: string
  items: string[]
}

// List of allowed email addresses
const ALLOWED_EMAILS = [
  // Add your allowed email addresses here
  'danccoria@gmail.com',
  'sarahacoria@gmail.com',
  'ifdanthencool@gmail.com'
];

function App() {
  const [boxes, setBoxes] = useState<Box[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAddBox, setShowAddBox] = useState(false)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        fetchBoxes()
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        fetchBoxes()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchBoxes() {
    try {
      const { data: boxesData, error: boxesError } = await supabase
        .from('boxes')
        .select('*')
        .order('created_at', { ascending: false })

      if (boxesError) throw boxesError

      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*')

      if (itemsError) throw itemsError

      const boxesWithItems = boxesData.map(box => ({
        id: box.id,
        name: box.name,
        items: itemsData
          .filter(item => item.box_id === box.id)
          .map(item => item.name)
      }))

      setBoxes(boxesWithItems)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBox = async (boxName: string) => {
    try {
      const { data, error } = await supabase
        .from('boxes')
        .insert([{ name: boxName }])
        .select()
        .single()

      if (error) throw error

      setBoxes([{ id: data.id, name: data.name, items: [] }, ...boxes])
      setShowAddBox(false)
    } catch (error) {
      console.error('Error adding box:', error)
    }
  }

  const handleEditBox = async (boxId: string, newName: string) => {
    try {
      const { error } = await supabase
        .from('boxes')
        .update({ name: newName })
        .eq('id', boxId)

      if (error) throw error

      setBoxes(boxes.map(box => 
        box.id === boxId ? { ...box, name: newName } : box
      ))
    } catch (error) {
      console.error('Error editing box:', error)
    }
  }

  const handleDeleteBox = async (boxId: string) => {
    try {
      const { error } = await supabase
        .from('boxes')
        .delete()
        .eq('id', boxId)

      if (error) throw error

      setBoxes(boxes.filter(box => box.id !== boxId))
    } catch (error) {
      console.error('Error deleting box:', error)
    }
  }

  const handleAddItem = async (boxId: string, itemName: string) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .insert([{ name: itemName, box_id: boxId }])
        .select()
        .single()

      if (error) throw error

      setBoxes(boxes.map(box => {
        if (box.id === boxId) {
          return {
            ...box,
            items: [...box.items, itemName],
          }
        }
        return box
      }))
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  const handleEditItem = async (boxId: string, itemIndex: number, newName: string) => {
    try {
      // First, get the item ID
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('id')
        .eq('box_id', boxId)
        .order('created_at', { ascending: true })

      if (itemsError) throw itemsError
      if (!itemsData || !itemsData[itemIndex]) throw new Error('Item not found')

      const itemId = itemsData[itemIndex].id

      const { error } = await supabase
        .from('items')
        .update({ name: newName })
        .eq('id', itemId)

      if (error) throw error

      setBoxes(boxes.map(box => {
        if (box.id === boxId) {
          const newItems = [...box.items]
          newItems[itemIndex] = newName
          return { ...box, items: newItems }
        }
        return box
      }))
    } catch (error) {
      console.error('Error editing item:', error)
    }
  }

  const handleDeleteItem = async (boxId: string, itemIndex: number) => {
    try {
      // First, get the item ID
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('id')
        .eq('box_id', boxId)
        .order('created_at', { ascending: true })

      if (itemsError) throw itemsError
      if (!itemsData || !itemsData[itemIndex]) throw new Error('Item not found')

      const itemId = itemsData[itemIndex].id

      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      setBoxes(boxes.map(box => {
        if (box.id === boxId) {
          const newItems = box.items.filter((_, i) => i !== itemIndex)
          return { ...box, items: newItems }
        }
        return box
      }))
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const filteredBoxes = useMemo(() => {
    if (!searchQuery) return boxes;
    
    const query = searchQuery.toLowerCase();
    return boxes.filter(box => 
      box.name.toLowerCase().includes(query) ||
      box.items.some(item => item.toLowerCase().includes(query))
    );
  }, [boxes, searchQuery]);

  if (!session) {
    return <Auth allowedEmails={ALLOWED_EMAILS} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[90%] md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Moving List</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddBox(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Box
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-gray-600 hover:text-gray-800"
            >
              Sign out
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <SearchBar onSearch={setSearchQuery} />
          <BoxList 
            boxes={filteredBoxes}
            onDeleteBox={handleDeleteBox}
            onEditBox={handleEditBox}
            onDeleteItem={handleDeleteItem}
            onEditItem={handleEditItem}
            onAddItem={handleAddItem}
          />
        </div>
      </div>

      {showAddBox && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Create New Box</h2>
              <button
                onClick={() => setShowAddBox(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <AddBoxForm onAddBox={handleAddBox} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
